
import styles from './App.css';
import fonts from './font-awesome.min.css';
import React, { Component } from 'react';
import DotsActions from './actions/DotsActions.js'
import DotsStore from './stores/DotsStore.js'
import AppDispatcher from './dispatchers/AppDispatcher';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import * as d3 from 'd3';

var _DotsStore = new DotsStore(AppDispatcher, { base : 2 });

var getDotsStateByIndex = (index) => {
  return {
    base : _DotsStore.getBase(),
    value : _DotsStore.getDotsValueByIndex(index),
    dots : _DotsStore.getDotsValue()
  }
}


var getDotsState = () => {
  return {
    base : _DotsStore.getBase(),
    dots : _DotsStore.getDotsValue()
  }
}



class DotsContainer extends Component{
  
  constructor(props){
    super();
    this.state = {
      base : 2,
      value : 0,
      index: props.index
    }; 

  }

  plusOne(){
    var v = this.state.value+1;
    DotsActions.dotsChanged(this.state.index, v);
  }

  minusOne(){
    if(this.state.value > 0){
      var v = this.state.value-1;
      DotsActions.dotsChanged(this.state.index, v);
    }
  }


  updateBase(value, base){
      return Math.round(value / base);
  }


  _onChange(){
    this.setState(getDotsStateByIndex(this.state.index));
  }


  // Add change listeners to stores
  componentDidMount() {
    _DotsStore.addChangeListener(this._onChange.bind(this));
  }

  // Remove change listeners from stores
  componentWillUnmount() {
    _DotsStore.removeChangeListener(this._onChange.bind(this));
  }





  render() {

    //var baseIsOver = (this.state.value > (this.state.base-1));


    return (
      <div className="dotsContainer">
        <div className="title">x<sup>{this.state.index}</sup></div>
        <span className="nbDots">{this.state.value}</span>
        <button onClick={this.plusOne.bind(this)}>+1</button>
        <button onClick={this.minusOne.bind(this)}>-1</button>
        <div className={"baseNumber baseNumber2 " + (this.state.value > (this.state.base-1) ? 'baseIsOver' : '')}>{this.state.value}</div>
      </div>);
  }
}



class SVGContainer extends React.Component {
  

  constructor(props){
    super();

    this.state = {
      width : 300,
      height : 300,
      base : 2
    }

    this.dots = [];
  }

  // Add change listeners to stores
  componentDidMount() {
     _DotsStore.addChangeListener(this._onChange.bind(this));
    d3.select(this.refs.zone).on("click", this.addDot.bind(this) );
  }

  _onChange(){
    this.setState(getDotsStateByIndex(this.props.index));
  }

  // Remove change listeners from stores
  componentWillUnmount() {
    d3.select(this.refs.zone).on("click", null );
    _DotsStore.removeChangeListener(this._onChange.bind(this));
  }

  addDot(event){
    var v = this.dots.length+1;

    var pos = d3.mouse(this.refs.zone);

    DotsActions.dotsChanged(this.props.index, v, pos[0], pos[1]);
  }


  
  render() {


    var statedots = _DotsStore.getDotsValue()[this.props.index];
    var positive = statedots.length;

    if( this.dots.length > positive ) {
      this.dots.splice( positive, this.dots.length - positive );
    } else if( this.dots.length < positive ) {
      for( var i = this.dots.length; i < positive; i++) {
        this.dots.push(<SVGDot key={i} x={statedots[i].x} y={statedots[i].y} positive={true}/>)
      }
    }

    var reverseIndex = (_DotsStore.getNbContainers() - this.props.index - 1);
    var style = (this.state.base <= this.dots.length) ? "dotGroup shaking" : "dotGroup";
    var position = `translate(${reverseIndex*(this.state.width+20)},0)`;

    return (

      <g transform={position} className={style}>
        <rect className="dotBox" />
        
        <rect className="dotBoxTitle" />
        <text x={(this.state.width/2)+9} y="45" className="dotBoxTitleText" textAnchor="middle">{Math.pow(10,this.props.index)}</text>

        <ReactCSSTransitionGroup transitionName="svgDot" component="g" 
            transitionEnterTimeout={300} transitionLeaveTimeout={500} >
          {this.dots}
        </ReactCSSTransitionGroup >
      </g>
        
    );
  }
}



class SVGFullSizeContainer extends React.Component {
  

  constructor(props){
    super();

    this.state = {
      dots : [0, 0, 0, 0, 0]
    }
  }

  // Add change listeners to stores
  componentDidMount() {
    _DotsStore.addChangeListener(this._onChange.bind(this));
  }

  // Remove change listeners from stores
  componentWillUnmount() {
    _DotsStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange(){
    this.setState(getDotsState());
  }


  
  render() {

    return (
      <div className="SVGContainer">
        <div className="scrollContainer">

          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1600 300">
            <g>
              <SVGContainer className="SVGContainer" index={4} dots={this.state.dots} />
              <SVGContainer className="SVGContainer" index={3} dots={this.state.dots} />
              <SVGContainer className="SVGContainer" index={2} dots={this.state.dots} />
              <SVGContainer className="SVGContainer" index={1} dots={this.state.dots} />
              <SVGContainer className="SVGContainer" index={0} dots={this.state.dots} />
            </g>
            <g id="stage"></g>
          </svg>

        </div>
      </div>
    );
  }
}

class SVGDot extends React.Component {



  constructor(props){
    super();

    this.state = {selected:false};
  }

  componentDidMount() {
    d3.select(this.refs.dot).call(d3.drag()
      .on("start", this.dragstarted.bind(this))
      .on("drag", this.dragged.bind(this))
      .on("end", this.dragended.bind(this)));
  }

  componentWillUnmount() {
    d3.drag()
    .subject(this.refs.dot)
    .on("start", null)
    .on("drag", null)
    .on("end", null);
  }


  dragstarted(event){
    
    console.log("dragstarted");

    var stage = d3.select("#stage");
    var stageNode = stage.node();
    stageNode.appendChild(d3.select(this.refs.dot).node());

    this.setState({
      selected: true
    });
  }

  dragended(event){

    console.log("dragended")

    this.setState({
      selected: false
    });
  }

  dragged(event){
    console.log("dragged");

    //var stage = d3.select("#stage").attr("transform");
    //var translate = d3.transform(stage).translate;  //returns [0,-25]

    d3.select(this.refs.dot)
      .attr("cx", d3.event.x)
      .attr("cy", d3.event.y);
  }



  render(){

    var style = (this.state.selected) ? "dotCircle dotCircleSelected" : "dotCircle";

    var x = Math.min(Math.max(this.props.x, _DotsStore.getRightLimit()), _DotsStore.getLeftLimit());
    var y = Math.min(Math.max(this.props.y, _DotsStore.getTopLimit()), _DotsStore.getBottomLimit());

    return (<circle ref="dot" cx={x} cy={y} r={_DotsStore.getDotsRayon()} className={style} />)
  }
}




class ConfigPanel extends Component{


  constructor(props){
    super();

    this.state = {base : 2 };
  }



  _select(event){
    DotsActions.changeBase(Number.parseInt(event.target.value));
  }


  stabilize(event){
    DotsActions.stabilize();
  }


  oneStepStabilize(event){
    DotsActions.oneStepStabilize();
  }


  render() {
    return (
      <div className="configPanel" onChange={this._select} value={this.state.base}>
        <select onChange={this._select} >
          <option value="2">Base 2</option>
          <option value="10">Base 10</option>
          <option value="16">Base 16</option>
        </select>

        <input type="button" value="Stabiliser le système" onClick={this.stabilize} />
        <input type="button" value="Stabiliser une étape" onClick={this.oneStepStabilize} />
      </div>
    );
  }
}




class App extends Component {

  constructor(options){

      super(options); 

      //this.store = new DotsStore(AppDispatcher, options.state);
      this.state = {base : 2 };

  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
	        <h2>Exploding <strong>dots</strong>
	        	<span>
	        		<button className="base">1 <i className="fa fa-long-arrow-left"></i> {this.state.base}</button>
	        		<button><i className="fa fa-play"></i></button>
	        		<button className="explode"><i className="fa fa-magic"></i></button>
	        	</span>
	        </h2>
        </div>
        <div className="App-intro">

          <div className="configPanelWrapper">
            <ConfigPanel />
          </div>

          <div className="dotsContainers">
            <DotsContainer index="4" />
            <DotsContainer index="3" />
            <DotsContainer index="2" />
            <DotsContainer index="1" />
            <DotsContainer index="0" />
          </div>

          <div className="dotsFullSizeContainers">
            <SVGFullSizeContainer className="SVGFullSizeContainer" />

          </div>


        </div>
      </div>
    );
  }
}

export default App;



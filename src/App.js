
import styles from './App.css';
import './font-awesome.min.css';
import logo from './scolab.png';
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
      DotsActions.dotRemoved(this.state.index);
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
      height : 400,
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

    var zoneIndex = this.props.index;
    var _this = this;

    this.dots = [];
    statedots.forEach(function(dot, index){
        var key = zoneIndex + "." + dot.x + "." + dot.y;
        _this.dots.push(<SVGDot key={key} index={index} x={dot.x} y={dot.y} positive={true} zoneIndex={zoneIndex} />);
    });


    var reverseIndex = (_DotsStore.getNbContainers() - this.props.index - 1);
    var style = (this.state.base <= this.dots.length) ? "dotGroup shaking" : "dotGroup";
    var position = `translate(${reverseIndex*(this.state.width+20)},0)`;

    return (

      <g transform={position} className={style} className="dropZone">
        <rect ref="zone" className="dotBox" />
        
        <rect className="dotBoxTitle" />
        <text x={(this.state.width/2)+9} y="45" className="dotBoxTitleText" textAnchor="middle">{Math.pow(10,this.props.index)}</text>

        <ReactCSSTransitionGroup transitionName="svgDot" component="g" className={style} 
        	transitionEnterTimeout={300} transitionLeaveTimeout={500}>
          {this.dots}
        </ReactCSSTransitionGroup>
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
    d3.select("#stage circle").style("display","none");
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

          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1600 400">
            <g>
              <SVGContainer className="SVGContainer" index={4} dots={this.state.dots} />
              <SVGContainer className="SVGContainer" index={3} dots={this.state.dots} />
              <SVGContainer className="SVGContainer" index={2} dots={this.state.dots} />
              <SVGContainer className="SVGContainer" index={1} dots={this.state.dots} />
              <SVGContainer className="SVGContainer" index={0} dots={this.state.dots} />
            </g>
            <g id="stage">
              <SVGDot key={0} x={0} y={0} positive={true} zoneIndex={0} className="draggedDot" />
            </g>
          </svg>

        </div>
      </div>
    );
  }
}

class SVGDot extends React.Component {



  constructor(props){



    super();

    this.state = {
      zoneIndex : props.zoneIndex,
      selected:false
    };
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

    //var stageNode = d3.select("#stage").node();
    //stageNode.appendChild(d3.select(this.refs.dot).node());

    d3.select("#stage circle").style("display","block");

    this.setState({
      selected: true
    });
  }

  dragended(event){

    d3.select("#stage circle").style("display","none");


    //find new zone for dots
    var dropzones = d3.selectAll(".dropZone");
    var currentZoneIndex = -1;
    var currentZone;
    dropzones._groups[0].forEach(function(zone, index){
      var posInZone = d3.mouse(zone);
      if(posInZone[0] > 0){
        currentZoneIndex = dropzones._groups[0].length - index - 1;
        currentZone = zone;
      }      
    });

    

    DotsActions.dotRemoved(this.state.zoneIndex, this.props.index);

    var newNbOfDots = _DotsStore.getDotsValueByIndex(currentZoneIndex)+1;
    var pos = d3.mouse(currentZone);
    DotsActions.dotsChanged(currentZoneIndex, newNbOfDots, pos[0], pos[1]);
  }

  dragged(event){

    var m = d3.mouse(stage);
    d3.select("#stage circle")
      .attr("cx", m[0])
      .attr("cy", m[1]);
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
    console.log(this);
  }



  changeBase(event){
    DotsActions.changeBase();
  }

  stabilize(event){
    DotsActions.stabilize();
  }

  oneStepStabilize(event){
    DotsActions.oneStepStabilize();
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
    this.setState({base : _DotsStore.getBase()});
  }

  render() {
    return (
      <div className="configPanel">
        <button onClick={this.changeBase} className="base">1 <i className="fa fa-long-arrow-left"></i> {this.state.base}</button>
        <button onClick={this.stabilize}><i className="fa fa-play"></i></button>
        <button onClick={this.oneStepStabilize} className="explode"><i className="fa fa-magic"></i></button>
      </div>
    );
  }
}




class App extends Component {

  constructor(options){
    super(options); 

    //this.store = new DotsStore(AppDispatcher, options.state);
  }

  render() {
    return (
      <div className="scolab">
        <div className="App">
          <div className="App-header">
            <h2>Exploding <strong>dots</strong></h2>
            <ConfigPanel />
          </div>

          <div className="App-intro">
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
        <div className="credits">
          <a href="http://www.scolab.com" target="_blank">Une présentation de <img src={logo} width="65" alt="Une présentation de Scolab Inc. - scolab.com" /></a>
        </div>
      </div>
    );
  }
}

export default App;



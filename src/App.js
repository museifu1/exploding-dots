import React, { Component } from 'react';
import './App.css';
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

    var baseIsOver = (this.state.value > (this.state.base-1));


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
      height : 450
    }

    this.dots = [];
  }

  // Add change listeners to stores
  componentDidMount() {
    
    d3.select(this.refs.zone).on("click", this.addDot.bind(this) );
  }

  // Remove change listeners from stores
  componentWillUnmount() {
    d3.select(this.refs.zone).on("click", null );
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


    var style = (this.props.baseIsOver) ? "shaking" : "";
    var position = `translate(${(_DotsStore.getNbContainers() - this.props.index - 1)*(this.state.width+20)},0)`;

    return (

      <g transform={position}>
        <rect x="0" y="5" width={this.state.width} height={this.state.height} fill="#e1e1e1" />
        <rect ref="zone" x="-5" y="0" width={this.state.width} height={this.state.height} fill="#7BBBDD" />


        <ReactCSSTransitionGroup transitionName="svgDot" component="g" 
            transitionEnterTimeout={300} transitionLeaveTimeout={300} >
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
        <div className="title">Exploding Dots!</div>


        <div className="scrollContainer">

          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1600 900">
            <SVGContainer className="SVGContainer" index={4} dots={this.state.dots}  baseIsOver={false} />
            <SVGContainer className="SVGContainer" index={3} dots={this.state.dots}  baseIsOver={false} />
            <SVGContainer className="SVGContainer" index={2} dots={this.state.dots}  baseIsOver={false} />
            <SVGContainer className="SVGContainer" index={1} dots={this.state.dots}  baseIsOver={false} />
            <SVGContainer className="SVGContainer" index={0} dots={this.state.dots}  baseIsOver={false} />
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


  handleMouseDown(){
    
    this.setState({
      selected: true
    });
  }

  handleMouseUp(){
    this.setState({
      selected: false
    });
  }

  render(){

    var color = (this.state.selected) ? "#eddc4c" : "#E6CD00";

    //if( !this.props.positive ) {
      return (<circle cx={this.props.x} cy={this.props.y} r={_DotsStore.getDotsRayon()} fill={color} stroke={2} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} />)
    //}

    /*return (<g onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)}>
              <circle cx={this.props.x} cy={this.props.y} r={40} fill={color} stroke={2} />
              <circle cx={this.props.x} cy={this.props.y} r={35} fill="white" stroke={2} />
            </g>);*/
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


  render() {
    return (
      <div className="configPanel" onChange={this._select} value={this.state.base}>
        <select onChange={this._select} >
          <option value="2">Base 2</option>
          <option value="10">Base 10</option>
          <option value="16">Base 16</option>
        </select>

        <input type="button" value="Stabiliser le système" onClick={this.stabilize} />
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
      <div className="App">
        <div className="App-header">
          <h2>Exploding dots!</h2>
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
            <SVGFullSizeContainer className="SVGFullSizeContainer" baseIsOver={false} />

          </div>


        </div>
      </div>
    );
  }
}

export default App;



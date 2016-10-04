
import styles from './App.css';
import React, { Component } from 'react';
import DotsActions from './actions/DotsActions.js'
import DotsStore from './stores/DotsStore.js'
import AppDispatcher from './dispatchers/AppDispatcher';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

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
      width : 400,
      height : 650
    }

    this.dots = [];
  }


  addDot(event){
    var v = this.dots.length+1;

    var rect = event.target.getBoundingClientRect();

    var posx = event.clientX - rect.left;
    var posy = event.clientY - rect.top;

    DotsActions.dotsChanged(this.props.index, v, posx, posy);
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

    var position = `translate(${1200 - this.props.index*450},0)`;

    return (

      <g transform={position}>
        <rect x="0" y="0" width={this.state.width} height={this.state.height} fill="#fff" onClick={this.addDot.bind(this)} />


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
      dots : [0, 0, 0]
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
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1600 900">

          <SVGContainer className="SVGContainer" index={2} positive={this.state.dots[2].length}  baseIsOver={false} />
          <SVGContainer className="SVGContainer" index={1} positive={this.state.dots[1].length}  baseIsOver={false} />
          <SVGContainer className="SVGContainer" index={0} positive={this.state.dots[0].length}  baseIsOver={false} />
        </svg>
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
        <h2>Exploding dots</h2>
        </div>
        <div className="App-intro">

          <div className="configPanelWrapper">
            <ConfigPanel />
          </div>

          <div className="dotsContainers">
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



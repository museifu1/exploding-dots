import React, { Component } from 'react';
import './App.css';
import DotsActions from './actions/DotsActions.js'
import DotsStore from './stores/DotsStore.js'
import AppDispatcher from './dispatchers/AppDispatcher';



var _DotsStore = new DotsStore(AppDispatcher, { base : 2 });

var getDotsState = (index) => {
  return {
    base : _DotsStore.getBase(),
    value : _DotsStore.getDotsValue(index)
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
    //this.setState({value : v});
    DotsActions.dotsChanged(this.state.index, v);
    //this.updateBases(v);
  }

  minusOne(){
    if(this.state.value > 0){
      var v = this.state.value-1;
      //this.setState({value : v});
      DotsActions.dotsChanged(this.state.index, v);
      //this.updateBases(v);
    }
  }

  /*
  updateBases(value){
    this.setState({
      base2 : this.updateBase(value, 2),
      base16 : this.updateBase(value, 16)
    })
  }*/

  updateBase(value, base){
      return Math.round(value / base);
  }


  _onChange(){
    console.log("_onChange", getDotsState(this.state.index));
    this.setState(getDotsState(this.state.index));
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
        <div className={"baseNumber baseNumber2 " + (this.state.value > 15 ? 'baseIsOver' : '')}>{this.state.value}</div>

        
        <SVGContainer className="SVGContainer" positive={this.state.value} baseIsOver={baseIsOver} />

        
      </div>);
  }
}

class SVGContainer extends React.Component {
  

  constructor(props){
    super();

    this.dots = [];
  }
  
  render() {

    if( this.dots.length > this.props.positive ) {
      this.dots.splice( this.props.positive, this.dots.length - this.props.positive );
    } else if( this.dots.length < this.props.positive ) {
      for( var i = this.dots.length; i < this.props.positive; i++) {

        var positive = Math.round(Math.random());

        this.dots.push(<SVGDot key={i} x={50+Math.random() * 400} y={50+Math.random() * 400} positive={positive}/>)
      }
    }

    var style = (this.props.baseIsOver) ? "shaking" : "";

    return (
      <div className="SVGContainer">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 500 500" className={style}>
          <g>
            {this.dots}
          </g>
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

    var color = (this.state.selected) ? "red" : "blue";

    if( !this.props.positive ) {
      return <circle cx={0} cy={0} r={40} fill={color} stroke={2} transform={`translate(${this.props.x},${this.props.y})`} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)}/>
    }

    return (<g transform={`translate(${this.props.x},${this.props.y})`} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)}>
              <circle cx={0} cy={0} r={40} fill={color} stroke={2} />
              <circle cx={0} cy={0} r={35} fill="white" stroke={2} />
            </g>);
  }
}




class ConfigPanel extends Component{


  constructor(props){
    super();

    this.state = {base : 2 };
  }



  _select(event){
    //this.setState({base : event.target.value})
    console.log(Number.parseInt(event.target.value));
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
            <DotsContainer index="2" />
            <DotsContainer index="1" />
            <DotsContainer index="0" />
          </div>


        </div>
      </div>
    );
  }
}

export default App;



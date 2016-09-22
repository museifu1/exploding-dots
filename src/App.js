import React, { Component } from 'react';
import './App.css';





class DotsContainer extends Component{
  
  constructor(props){
    super();
    this.state = {
      value : 0,
      index: props.index,
      base2 : 0,
      base16 : 0
    }; 

  }

  plusOne(){
    var v = this.state.value+1;
    this.setState({value : v});
    this.updateBases(v);
  }

  minusOne(){
    if(this.state.value > 0){
      var v = this.state.value-1;
      this.setState({value : v});
      this.updateBases(v);
    }
  }


  updateBases(value){
    this.setState({
      base2 : this.updateBase(value, 2),
      base16 : this.updateBase(value, 16)
    })
  }

  updateBase(value, base){
      return Math.round(value / base);
  }



  render() {
    return (
      <div className="dotsContainer">
        <div className="title">x<sup>{this.state.index}</sup></div>
        <span className="nbDots">{this.state.value}</span>
        <button onClick={this.plusOne.bind(this)}>+1</button>
        <button onClick={this.minusOne.bind(this)}>-1</button>

        <div className={"baseNumber baseNumber2 " + (this.state.value > 1 ? 'baseIsOver' : '')}>{this.state.value}</div>
        <div className={"baseNumber baseNumber2 " + (this.state.value > 15 ? 'baseIsOver' : '')}>{this.state.value}</div>

        
        <SVGContainer className="SVGContainer" positive={this.state.value} />

        
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

    

    return (
      <div className="SVGContainer">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 500 500">
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
  }

  render(){

    if( !this.props.positive ) {
      return <circle cx={this.props.x} cy={this.props.y} r={25} fill="blue" stroke={2} mask="url(#dotmask)"/>
    }

    return <path fill="#0033FF" stroke="none" transform={`translate(${this.props.x},${this.props.y})`} d="
M 50 24.95
Q 50 14.55 42.7 7.25 35.3 -0.05 25 -0.05 14.7 -0.05 7.3 7.25 0 14.55 0 24.95 0 35.25 7.3 42.55 14.7 49.95 25 49.95 35.3 49.95 42.7 42.55 50 35.25 50 24.95
M 8.5 24.85
Q 8.5 17.95 13.3 13.15 18.2 8.25 25 8.25 31.8 8.25 36.7 13.15 41.5 17.95 41.5 24.85 41.5 31.65 36.7 36.45 31.8 41.35 25 41.35 18.2 41.35 13.3 36.45 8.5 31.65 8.5 24.85 Z"/>
  }
}




class ConfigPanel extends Component{
  render() {
    return (
      <div className="configPanel">
        <select>
          <option value="2">Base 2</option>
          <option value="2">Base 10</option>
          <option value="2">Base 16</option>
        </select>
      </div>
    );
  }
}




class App extends Component {
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



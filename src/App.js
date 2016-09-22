import React, { Component } from 'react';
import './App.css';
import DotsActions from './actions/DotsActions.js'
import DotsStore from './stores/DotsStore.js'
import AppDispatcher from './dispatchers/AppDispatcher';





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

        <div className={"baseNumber baseNumber2 " + (this.state.value > App.store.getState().base ? 'baseIsOver' : '')}>{this.state.value}</div>
        <div className={"baseNumber baseNumber2 " + (this.state.value > 15 ? 'baseIsOver' : '')}>{this.state.value}</div>
      </div>);
  }
}




class ConfigPanel extends Component{

  _select(){

  }


  render() {
    return (
      <div className="configPanel" onChange={DotsActions.changeBase}>
        <select onChange={this._select} >
          <option value="2">Base 2</option>
          <option value="2">Base 10</option>
          <option value="2">Base 16</option>
        </select>
      </div>
    );
  }
}




class App extends Component {

  constructor(options){

      super(options); 

      this.store = new DotsStore(AppDispatcher, options.state);

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




import './../css/App.css';
import React, { Component } from 'react';
import DotsActions from './../actions/DotsActions.js'
import DotsStore from './../stores/DotsStore.js'
import AppDispatcher from './../dispatchers/AppDispatcher';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import * as d3 from 'd3';
import shallowequal from'shallowequal';
import Radium from 'radium';
import App2 from 'testApp';

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
    dots : _DotsStore.getDotsValue(),
    dotsCount: _DotsStore.getDotsCount(),
    dotsNum: _DotsStore.getDotsNum()
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
      DotsActions.removeDots(this.state.index);
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

  shouldComponentUpdate(nextProps, nextState){
    return !shallowequal(this.state, nextState);
  }

  render() {
    return (
      <div style={dotsContainerStyle.base}>
        <div style={dotsContainerStyle.title}>x<sup>{this.state.index}</sup></div>
        <span style={dotsContainerStyle.nbDots}>{this.state.value}</span>
        <button style={dotsContainerStyle.button} onClick={this.plusOne.bind(this)}>+1</button>
        <button style={dotsContainerStyle.button} onClick={this.minusOne.bind(this)}>-1</button>
        <div style={[dotsContainerStyle.baseNumber, (this.state.value > (this.state.base-1)) && dotsContainerStyle.baseIsOver ]}>{this.state.value}</div>
      </div>);
  }
}
DotsContainer = Radium(DotsContainer);

const shakeAnimation = Radium.keyframes({
  '3%':   {transform: "translate3d(-2px, 0, 0)"},
  '5%':   {transform: "translate3d(2px, 0, 0)"},
  '8%':   {transform: "translate3d(-2px, 0, 0)"},
  '10%':   {transform: "translate3d(2px, 0, 0)"},
  '13%':   {transform: "translate3d(-2px, 0, 0)"},
  '15%':   {transform: "translate3d(2px, 0, 0)"},
  '18%':   {transform: "translate3d(-2px, 0, 0)"},
  '20%':   {transform: "translate3d(2px, 0, 0)"},
  '22%':   {transform: "translate3d(-2px, 0, 0)"},
  '25%':   {transform: "translate3d(0px, 0, 0)"},
});
const dotsContainerStyle = {
  base: {
    width: "18%",
    display: "inline-block",
    margin: "1%",
    backgroundColor: "#fff"
  },
  title: {
    padding: "5px",
    backgroundColor: "#f0f0f0",
    display: "none"
  },
  nbDots: {
    width: "100%",
    float: "left",
    margin: "10px 0px 5px",
    fontSize: "1em",
    color: "#555",
    display: "none"
  },
  button: {
    display: "none"
  },
  baseIsOver: {
    color: "#e96656",
    animation: shakeAnimation + "2s cubic-bezier(.36,.07,.19,.97) both infinite",
    transform: "translate3d(0, 0, 0)"
  },
  baseNumber: {
    color: "#CCC",
  	display: "block",
  	font: "700 4em/1.5em 'Montserrat', sans-serif"
  }
}


class SVGContainer extends React.Component {


  constructor(props){
    super();

    this.state = {
      width : 300,
      height : 400
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

  shouldComponentUpdate(nextProps, nextState){
    if(this.props.base != nextProps.base){
      return true;
    }

    if(this.props.dots.length != nextProps.dots.length){
      return true;
    }

    for (let i = 0 ; i < this.props.dots.length; i++){
      if(!shallowequal(this.props.dots[i], nextProps.dots[i])){
        return true;
      }
    }

    return false;
  }

  render() {

    var statedots = this.props.dots;

    var zoneIndex = this.props.index;
    var _this = this;

    this.dots = [];
    statedots.forEach(function(dot, index){
        var key = zoneIndex + "." + dot.x + "." + dot.y;
        if(_this.dots.length <= _DotsStore.getMaxViewableDots())
          _this.dots.push(<SVGDot key={key} index={index} x={dot.x} y={dot.y} style={dot.style} positive={true} zoneIndex={zoneIndex} />);
    });

    var reverseIndex = (_DotsStore.getNbContainers() - this.props.index - 1);
    var style = (this.props.base <= this.dots.length) ? "dotGroup shaking" : "dotGroup";
    var position = `translate(${reverseIndex*(this.state.width+20)},0)`;

    return (

      <g transform={position} className="dropZone">
        <rect ref="zone" className="dotBox" />

        <rect className="dotBoxTitle" />
        <text x={(this.state.width/2)+9} y="45" className="dotBoxTitleText" textAnchor="middle">{Math.pow(this.props.base,this.props.index)}</text>

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
      dots : [ [], [], [], [], [] ],
      base : 2
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
              <SVGContainer className="SVGContainer" index={4} dots={this.state.dots[4]} base={this.state.base}/>
              <SVGContainer className="SVGContainer" index={3} dots={this.state.dots[3]} base={this.state.base}/>
              <SVGContainer className="SVGContainer" index={2} dots={this.state.dots[2]} base={this.state.base}/>
              <SVGContainer className="SVGContainer" index={1} dots={this.state.dots[1]} base={this.state.base}/>
              <SVGContainer className="SVGContainer" index={0} dots={this.state.dots[0]} base={this.state.base}/>
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

    d3.select("#stage circle").style("display","block");

    this.setState({
      selected: true
    });
  }

  dragended(event){

    this.setState({
      selected: false
    });

    d3.select("#stage circle").style("display","none");


    //find new zone for dots
    var dropzones = d3.selectAll(".dropZone");
    var currentZoneIndex = -1;
    var currentZone;
    dropzones._groups[0].forEach(function(zone, index){
      var posInZone = d3.mouse(zone);
      var boundingZone = zone.getBoundingClientRect();
      if(posInZone[0] > 0 && posInZone[1] > 0 && posInZone[1] < boundingZone.bottom){
        currentZoneIndex = dropzones._groups[0].length - index - 1;
        currentZone = zone;
      }
    });

    var diffZone = this.props.zoneIndex - currentZoneIndex;
    var dotsToRemove = 1;
    if(diffZone < 0){
      dotsToRemove = Math.pow(_DotsStore.getBase(), diffZone*-1);
    }

    //Remove the dots
    var finalNbOfDots = _DotsStore.getDotsValueByIndex(this.props.zoneIndex) - dotsToRemove;
    if(finalNbOfDots < 0){
      alert("Pas assez de points disponibles pour cette opération");
      return false;
    }
    DotsActions.removeDots(this.props.zoneIndex, dotsToRemove, this.props.index, "no-animation");

    //Add the new dots
    var newNbOfDots = Math.pow(_DotsStore.getBase(), diffZone);
    var pos = d3.mouse(currentZone);
    DotsActions.addDots(currentZoneIndex, newNbOfDots, pos[0], pos[1], "dotmove");


  }

  dragged(event){
    //lint fails because stage is not declared
    var m = d3.mouse(stage);
    d3.select("#stage circle")
      .attr("cx", m[0])
      .attr("cy", m[1]);
  }

  shouldComponentUpdate(nextProps, nextState){
    return !shallowequal(this.props, nextProps) || !shallowequal(this.state, nextState);
  }

  render(){

    var style = (this.state.selected ? "dotCircle dotCircleSelected" : "dotCircle");
    if(this.props.style) style += " " + this.props.style;

    var x = Math.min(Math.max(this.props.x, _DotsStore.getRightLimit()), _DotsStore.getLeftLimit());
    var y = Math.min(Math.max(this.props.y, _DotsStore.getTopLimit()), _DotsStore.getBottomLimit());

    let circle = (<circle ref="dot" cx={x} cy={y} r={_DotsStore.getDotsRayon()} className={style} />);

    return circle;
  }
}




class ConfigPanel extends Component{


  constructor(props){
    super();
    this.state = {base : 2 };
  }

  changeBase(event){
    DotsActions.changeBase();
  }

  reset(event){
    DotsActions.clearDots();
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

  shouldComponentUpdate(nextProps, nextState){
    return this.state.base != nextState.base;
  }

  render() {
    return (
      <div className="configPanel">
        <button onClick={this.changeBase} className="base">1 <i className="fa fa-long-arrow-left"></i> {this.state.base}</button>
        <button onClick={this.stabilize} className="play"><i className="fa fa-play"></i></button>
        <button onClick={this.oneStepStabilize} className="explode"><i className="fa fa-magic"></i></button>
        <button onClick={this.reset} className="reset"><i className="fa fa-refresh"></i></button>
      </div>
    );
  }
}

class VisualPanel extends Component{


  constructor(props){
    super();
    this.state = getDotsState();
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

  shouldComponentUpdate(nextProps, nextState){
    return this.state.dotsCount != nextState.dotsCount;
  }

  render() {
    return (
      <div className="visualPanel">
        {this.state.dotsCount} <i className="fa fa-arrows-h"></i> <span className={((_DotsStore.getDotsNum() !== "?") ? 'ok' : '') + ((_DotsStore.isMachineStable()) ? '' : ' baseIsOver')}>{this.state.dotsNum}</span>
      </div>
    );
  }
}


class App extends Component {

  constructor(props){
    super(props);

    this.logo = props.logo;
    this.boum = props.boum;
  }

  render() {
    return (
      <div id="jeu" style={appStyle.scolab}>
        <div style={appStyle.app}>
          <div style={appStyle.header}>
          <h2 style={appStyle.h2}><img style={appStyle.img} src={this.boum} alt="Boum, Le Jeu Mathématique" /></h2>
            <ConfigPanel />
          </div>

          <div style={appStyle.intro}>
            <VisualPanel />
            <div>
              <DotsContainer index="4" />
              <DotsContainer index="3" />
              <DotsContainer index="2" />
              <DotsContainer index="1" />
              <DotsContainer index="0" />
            </div>

            <div>
              <SVGFullSizeContainer className="SVGFullSizeContainer" />
            </div>
          </div>
        </div>
        <div style={appStyle.credits}>
          <p style={appStyle.p}><a key="a" style={appStyle.a} href="http://www.scolab.com" target="_blank">Un projet de <img src={this.logo} width="65" alt="Une présentation de Scolab Inc. - scolab.com" /></a></p>
          <p style={appStyle.license}><small>Cette œuvre est mise à disposition selon les termes de la <a style={appStyle.a} href="https://creativecommons.org/licenses/by/4.0/" target="_blank">Licence Creative Commons Attribution 4.0 International</a>.</small></p>
        </div>
        <App2 />
      </div>
    );
  }
}
App = Radium(App);

const appStyle = {
  scolab: {
  	margin: "0 auto",
  	padding: "45px 0",
  	"maxWidth": "900px",
    "textAlign": "center"
  },
  app: {
  	"boxShadow": "5px 5px 0px 0px rgba(0,0,0,0.2)",
  	"fontSize": "1em"
  },
  header: {
    "backgroundColor": "#f0f0f0",
    height: "80px",
    position: "relative",
    "textAlign": "left"
  },
  h2: {
    "boxSizing": "border-box",
    font: "400 2em/2.5em 'Montserrat', sans-serif",
    "marginBottom": "8px",
    margin: "0 1%",
    padding: "0 40px",
    position: "relative",
    "textTransform": "uppercase",
    width: "98%"
  },
  img: {
  	height: "60px",
  	left: "40px",
  	position: "absolute",
  	top: "10px"
  },
  intro: {
    background: "#fff",
    fontSize: "0.6em",
    padding: "30px 40px 40px",
    textAlign: "center"
  },
  credits: {
    opacity: 0.5,
  	padding: "20px 25px",
  	"textAlign": "right",
  },
  license: {
    float: "left",
  	"textAlign": "left",
    "lineHeight": "normal",
    margin: 0
  },
  a: {
    color: "#000",
    "textDecoration": "none",
    ":focus": {
      "borderBottom": "1px solid #000",
      color: "#000"
    },
    ":hover": {
      "borderBottom": "1px solid #000",
      color: "#000"
    }
  },
  p: {
    float: "right",
    "lineHeight": "normal",
    margin: 0
  }
};

export default App;
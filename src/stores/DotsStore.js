import { EventEmitter } from 'events';
/*import assign from 'object-assign';*/
import {DOTS} from '../constants/DotsConstants';


const CHANGE_EVENT = 'change';

class DotsStore extends EventEmitter {


  constructor(dispatcher, state){

    super();

    this.setMaxListeners(20);

    if (!dispatcher) {      console.error(new Error('Store: dispatcher is required'));    }
    if (state) {            console.error('app is created with initial state', state);    }

    this.state = {
      base : 2 ,
      dots : [ [], [], [], [], [] ],
      nbContainers : 5,
      containerWidth : 300,
      containerHeight : 400,
      dotsRayon : 25,
      dotsCount: 0,
      dotsNum: "?",
      unstable: false,
      maxViewableDots: 150
    };

    var _this = this;

    // Register handlers
    dispatcher.register(function (action) {

      switch(action.actionType){
        case DOTS.BASE_CHANGED:
          _this.changeBase();
          break;

        case DOTS.DOTS_CHANGED:
          if(action.hasOwnProperty("newdot")){
             _this.state.dots[action.index] = [
               ..._this.state.dots[action.index],
               action.newdot
             ];
          }else{
             _this.state.dots[action.index] = _this.updateDotsArray(_this.state.dots[action.index], action.value);
          }
          break;

        case DOTS.DOT_REMOVED:
          _this.removeDots(action.zoneIndex, action.nbDots, action.dotIndex, action.style);
          break;

        case DOTS.DOT_ADDED:
          console.log("action.newdot :", action.newdot)
          _this.addDots(action.zoneIndex, action.nbDots, action.newdot);
          break;

        case DOTS.ONE_STEP_STABILIZE:
          _this.oneStepStabilize();
          break;

        case DOTS.STABILIZE:
          _this.stablize();
          break;

        case DOTS.CLEAR:
          _this.clearDots();
          break;

        default:
          return;//We don't want to cause an emitChange() for nothing.
      }

      _this.setDotsCount();
      _this.setDotsNum();
      _this.emitChange();

    });

  }

  setDotsCount(){
    let dotsCount = 0;
    let col = 0;

    for(let dot of this.state.dots){
        dotsCount += dot.length * Math.pow(this.state.base,col);
        col++;
    }
    this.state.dotsCount = dotsCount;
  }

  setDotsNum(){
    let dotsNum = "";
    this.state.unstable = false;

    for(let dot of this.state.dots){
        dotsNum = String(dot.length)+dotsNum;

        if(dot.length >= this.state.base && !this.state.unstable) this.state.unstable = true;
    }
    this.state.dotsNum = parseInt(dotsNum, 10);
    if(String(parseInt(this.state.dotsNum, 10))==="NaN" || parseInt(this.state.dotsNum, 10) === 0) this.state.dotsNum = "?";
  }

  changeBase(){
    let bases = [2, 3, 4, 5, 10];
    let next = false;
    for (let base of bases) {
      if(this.state.base < base && !next) next = base;
    }
    if(next === false) next = bases[0];
    this.state.base = next;
  }

  clearDots(){
    this.state.dots = [ [], [], [], [], [] ];
    this.state.dotsRayon = 25;
    this.state.dotsCount = 0;
    this.state.dotsNum = "?";
    this.state.unstable = false;
  }

  stablize(){

    var dots = this.state.dots;
    var base = this.state.base;
    var _this = this;

    dots.splice(this.state.nbContainers);

    dots.forEach(function(dot, index){

      if(dots.length <= index+1){
        dots.push([]);
      }

      dots[index+1] = _this.updateDotsArray(dots[index+1], dots[index+1].length + Math.floor(dot.length / base));
      dots[index] = _this.updateDotsArray(dots[index], dot.length % base);
    });
  }


  oneStepStabilize(startIndex = 0){

    var dots = this.state.dots;
    var base = this.state.base;
    var _this = this;

    var stepIsDone = false;


    dots.forEach(function(dot, index){

      if(!stepIsDone && index >= startIndex ){

        if(dots.length <= index+1){
          dots.push([]);
        }

        if(dot.length >= base){
          dots[index+1] = _this.updateDotsArray(dots[index+1], dots[index+1].length + 1);
          dots[index] = _this.updateDotsArray(dots[index], dot.length - base);

          stepIsDone = true;
        }
      }
    });
  }


  removeDots(zoneIndex, nbDots = 1, dotIndex = -1, dotStyle = ""){

    //this.state.dots[zoneIndex][0].style = dotStyle;
    //console.log("this.state.dots[zoneIndex][0]", this.state.dots[zoneIndex][0]);

    if(nbDots > 0 && dotIndex !== -1){
      this.state.dots[zoneIndex] = this.state.dots[zoneIndex].slice();
      this.state.dots[zoneIndex].splice(dotIndex, 1);
      //removed[0].style = dotStyle;
      //console.log("removed", removed);
      nbDots--;
    }

    if(nbDots > 0){
      //Todo : make those dots explode from dotIndex position
      this.state.dots[zoneIndex] = this.updateDotsArray(this.state.dots[zoneIndex], this.state.dots[zoneIndex].length-nbDots);
    }

  }

  addDots(zoneIndex, nbDots, newdot){
    if(nbDots > 0 && newdot !== undefined){
      this.state.dots[zoneIndex] = [
        ...this.state.dots[zoneIndex],
        newdot
      ];
      nbDots--;
    }

    if(nbDots > 0){
      //Todo : make those dots spawn from newdot position
      this.state.dots[zoneIndex] = this.updateDotsArray(this.state.dots[zoneIndex], this.state.dots[zoneIndex].length+nbDots);
    }
  }


  updateDotsArray(dotsArray, nbDots){
    if(dotsArray.length > nbDots){
      dotsArray.splice(nbDots);
    }else if(dotsArray.length < nbDots){
      dotsArray = dotsArray.concat(this.generateDots(nbDots - dotsArray.length));
    }
    return dotsArray;
  }


  generateDots(nbDots){
    var a = [];
    for(var i = 0; i < nbDots; i++){

      a.push({
        x : Math.random() * this.state.containerWidth,
        y : Math.random() * this.state.containerHeight
      });
    }

    return a;
  }

  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }

  emitChange(){
    this.emit('change');
  }

  getList() {
    //return _store;
  }

  getMaxViewableDots(){
    return this.state.maxViewableDots;
  }

  getBase(){
    return this.state.base;
  }

  getDotsValue(){
    return this.state.dots;
  }

  getDotsCount(){
    return this.state.dotsCount;
  }

  getDotsNum(){
    return this.state.dotsNum;
  }

  getDotsValueByIndex(index){
    return this.state.dots[index].length;
  }

  getDotsRayon(){
    return this.state.dotsRayon;
  }

  getNbContainers(){
    return this.state.nbContainers;
  }

  getLeftLimit(){
    return this.state.containerWidth - (this.state.dotsRayon + 10);
  }

  getRightLimit(){
    return this.state.dotsRayon + 30;
  }

  getTopLimit(){
    return this.state.dotsRayon + 70;
  }

  getBottomLimit(){
    return this.state.containerHeight - (this.state.dotsRayon + 10);
  }

  isMachineStable(){
    return !this.state.unstable;
  }

  /*getContainerWidth(){
    return this.state.containerWidth;
  }

  getContainerHeight(){
    return this.state.containerHeight;
  }*/

  getState () {
    //return this.state;
  }

}

export default DotsStore;

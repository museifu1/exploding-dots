import AppDispatcher from '../dispatchers/AppDispatcher';
import { EventEmitter } from 'events';
/*import assign from 'object-assign';*/
import {DOTS} from '../constants/DotsConstants';


const CHANGE_EVENT = 'change';

class DotsStore extends EventEmitter {


  constructor(dispatcher, state){
  	
  	super();

  	if (!dispatcher) {      console.error(new Error('Store: dispatcher is required'));    }
    if (state) {      		console.error('app is created with initial state', state);    }

    this.state = { 
      base : 2 ,
      dots : [ [], [], [] ],
      nbContainers : 3,
      containerWidth : 400,
      containerHeight : 650, 
      dotsRayon : 30
    };

    var _this = this;

    // Register handlers
    dispatcher.register(function (action) {

      switch(action.actionType){

        case DOTS.BASE_CHANGED:

          _this.state.base = action.base;          
          break;
        case DOTS.DOTS_CHANGED:

          if(action.hasOwnProperty("newdot")){
             _this.state.dots[action.index].push(action.newdot);
          }else{
             _this.state.dots[action.index] = _this.updateDotsArray(_this.state.dots[action.index], action.value);
          }
          break;
        case DOTS.STABILIZE:
          _this.stablize();         
          break;
      }

      _this.emitChange();

    });

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
        x : Math.min(Math.max(Math.random() * this.state.containerWidth, this.getDotsRayon()), this.state.containerWidth-this.getDotsRayon()),
        y : Math.min(Math.max(Math.random() * this.state.containerHeight,this.getDotsRayon()), this.state.containerHeight-this.getDotsRayon())
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


  getBase(){
  	return this.state.base;
  }

  getDotsValue(){
    return this.state.dots;
  }

  getDotsValueByIndex(index){
    return this.state.dots[index].length;
  }

  getDotsRayon(){
    return this.state.dotsRayon;
  }


  getState () {
    //return this.state;
  }

}

export default DotsStore;

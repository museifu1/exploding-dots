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
      dots : [ 0, 0, 0 ]
    };

    var _this = this;

    // Register handlers
    dispatcher.register(function (action) {

      switch(action.actionType){

        case DOTS.BASE_CHANGED:
          console.log("GET ACTION", action);
          _this.state.base = action.base;
          _this.emitChange();
          break;
        case DOTS.DOTS_CHANGED:
          console.log("dots changes", action);
          _this.state.dots[action.index] = action.value;
          _this.emitChange();
          break;
        case DOTS.STABILIZE:
          console.log("STABILIZE", action);
          _this.state.dots = [0, 0, 0];
          _this.emitChange();
          //this.stablize();
          break;

      }

    });

  }



  stablize(){

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

  getDotsValue(index){
    return this.state.dots[index];
  }


  getState () {
    //return this.state;
  }

}





// Default state
/*DotsStore.defaultState = {
  base : 2
};*/

export default DotsStore;


/*
const DotsStore = new DotsStoreClass();


AppDispatcher.register((payload) => {
  const action = payload.action;

  switch (action.actionType) {

  	case "baseSelected":

		break;

	default:
	    return true;
	}
});

export default DotsStore;*/
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

    state = { base : 10 };
    //state = _.merge({}, Store.defaultState, state);

    // Register handlers
    dispatcher.register(function (action) {
      if (action.actionType === DOTS.BASE_CHANGED) {
      	console.log("GET ACTION", action);
      	this.state.base = 2;
        //_this.onItemAdd(action.item);
        //_this.emit(CHANGE);
      }
    });

    console.log('store is loaded with state', state);

    // Turn state to immutable
    //_this.state = Immutable.fromJS(state);
  }



  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }

  getList() {
    return _store;
  }


  getBase(){
  	return this.base;
  }


  getState () {
    return this.state;
  }

}





// Default state
DotsStore.defaultState = {
  base : 10
};

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
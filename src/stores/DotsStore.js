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

    this.state = { base : 2 };
    //state = _.merge({}, Store.defaultState, state);

    var _this = this;

    // Register handlers
    dispatcher.register(function (action) {
      console.log()
      if (action.actionType === DOTS.BASE_CHANGED) {
      	console.log("GET ACTION", action);
        //console.log("action.actionType", action.actionType);
        //console.log("action.base", action.base);
      	_this.state.base = action.base;
        _this.emitChange();
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

  emitChange(){
    this.emit('change');
  }

  getList() {
    //return _store;
  }


  getBase(){
  	return this.state.base;
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
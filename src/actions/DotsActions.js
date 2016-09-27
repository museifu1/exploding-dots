import AppDispatcher from '../dispatchers/AppDispatcher';
import {DOTS} from '../constants/DotsConstants';

export default class DotsActions {

    static changeBase(value){
    	console.log("changebase", value);
    	AppDispatcher.dispatch({
    		actionType : DOTS.BASE_CHANGED,
    		base : value
    	});
    }

    static dotsChanged(_index, _value){
    	AppDispatcher.dispatch({
    		actionType : DOTS.DOTS_CHANGED,
    		index : _index,
    		value : _value
    	});
    }


    static stabilize(){
    	AppDispatcher.dispatch({
    		actionType : DOTS.STABILIZE
    	});

    }
}
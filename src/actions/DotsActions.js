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
}
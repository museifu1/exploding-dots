import AppDispatcher from '../dispatchers/AppDispatcher';
import {DOTS} from '../constants/DotsConstants';

export default class DotsActions {

    static changeBase(value){

    	AppDispatcher.dispatch({
    		actionType : DOTS.BASE_CHANGED,
    		base : value
    	});
    }

    static dotsChanged(_index, _value, _x, _y){

        var obj = {
            actionType : DOTS.DOTS_CHANGED,
            index : _index,
            value : _value
        };


        if(_x !== undefined && _y !== undefined){
            obj.newdot = {
                x : _x,
                y : _y
            }
        }

        AppDispatcher.dispatch(obj);
    }


    static oneStepStabilize(step = 0){
        AppDispatcher.dispatch({
            actionType : DOTS.ONE_STEP_STABILIZE,
            step : step
        });        
    }

    static stabilize(){
    	AppDispatcher.dispatch({
    		actionType : DOTS.STABILIZE
    	});
    }
}
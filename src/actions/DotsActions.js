import AppDispatcher from '../dispatchers/AppDispatcher';
import {DOTS} from '../constants/DotsConstants';

export default class DotsActions {

    static changeBase(value){

    	AppDispatcher.dispatch({
    		actionType : DOTS.BASE_CHANGED,
    		base : value
    	});
    }


    static dotAdded(_zoneIndex, _x, _y){

        var obj = {
            actionType : DOTS.DOT_ADDED,
            zoneIndex : _zoneIndex
        };


        if(_x !== undefined && _y !== undefined){
            obj.newdot = {
                x : _x,
                y : _y
            }
        }

        AppDispatcher.dispatch(obj);
    }


    static dotRemoved(_zoneIndex, _dotIndex = -1){
        
        AppDispatcher.dispatch({
            actionType : DOTS.DOT_REMOVED,
            zoneIndex : _zoneIndex,
            dotIndex : _dotIndex
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
import AppDispatcher from '../dispatchers/AppDispatcher';
import {DOTS} from '../constants/DotsConstants';

export default class DotsActions {

    static changeBase(value){

    	AppDispatcher.dispatch({
    		actionType : DOTS.BASE_CHANGED,
    		base : value
    	});
    }


    static addDots(_zoneIndex, _nbDots, _x, _y, _style){

        var obj = {
            actionType : DOTS.DOT_ADDED,
            nbDots : _nbDots,
            zoneIndex : _zoneIndex
        };


        if(_x !== undefined && _y !== undefined){
            obj.newdot = {
                x : _x,
                y : _y,
                style : _style
            }
        }

        AppDispatcher.dispatch(obj);
    }


    static removeDots(_zoneIndex, _nbDots = 1, _dotIndex = -1, _style = ""){
        
        AppDispatcher.dispatch({
            actionType : DOTS.DOT_REMOVED,
            zoneIndex : _zoneIndex,
            nbDots : _nbDots,
            dotIndex : _dotIndex,
            style : _style
        });
    }


    static dotsChanged(_index, _value, _x, _y, _style){

        var obj = {
            actionType : DOTS.DOTS_CHANGED,
            index : _index,
            value : _value
        };


        if(_x !== undefined && _y !== undefined){
            obj.newdot = {
                x : _x,
                y : _y,
                style : _style
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
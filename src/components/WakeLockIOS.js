import React, { useEffect,useReducer } from 'react';


const initialState = {
    timer: undefined
}

function reducer(state, action) {
    switch (action.type) {
        case 'assign':
            return {
                timer: action.payload
            };
        default:
            throw new Error();
    }
}


const WakeLockIOS=props=>{
    const [state, dispatch] = useReducer(reducer, initialState);


    const preventSleep=()=>{
        if (props.preventSleep && !state.timer) {
            
            

            let timer = setInterval(() => {
                
              if (!document.hidden) {  // gh-richtr/NoSleep.js#25
                console.log('hiii');
                window.location.href = window.location.href;  // gh-richtr/NoSleep.js#12
                setTimeout(window.stop, 0);
              }
      
            }, 15000);
            dispatch({type:'assign',payload:timer});
      
          }
      
          if (!preventSleep && state.timer) {
      
            clearInterval(state.timer);
            dispatch({type:'assign',payload:null});
          }
    }


    useEffect(()=>{
        if(preventSleep){
            addListeners();
        } else{
            removeListeners();
        }
    },[props.preventSleep]);

    const removeListeners=()=>{
        document.removeEventListener('touchend', preventSleep, false);
    }
    
    
    const addListeners=()=>{
        document.addEventListener('touchend', preventSleep, false);
    }

    return null
}



export default WakeLockIOS;
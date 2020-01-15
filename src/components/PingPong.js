import React, { useState, useEffect, useReducer} from 'react';
import text from '../utils/text';
import { stringSchema } from '../utils/packTypes';



const initialState = {
    lives: '♥♥♥',
    state: false
}

function reducer(state, action) {
    switch (action.type) {
        case 'lifelost':
            return {
                lives: state.lives.substring(0,(state.lives.length - 1)),
                isTurn: false
            };
        case 'po':
            return {
                lives: state.lives,
                isTurn: true
            }
        case 'pi':
            return {
                lives: state.lives,
                isTurn: false
            }
        default:
            throw new Error();
    }
}



let interval;

export const PingPong =props=>{
    const [bgColor,setBgColor] = useState('black');
    const [txtColor,setTxtColor] = useState('white');
    const [instructions,setInstructions] = useState('Wait for your turn');
    const [countDownText,setCountDownText] = useState('');
    // const [isTurn,setIsTurn] = useState(false);
    // const [inter,setInter] = useState(undefined);
    const [state, dispatch] = useReducer(reducer, initialState);


    const onClick=()=>{
        if(state.isTurn){
            props.socket.emit('pi');
            uiNotTurn();
            setInstructions(text.pingPong.instructions.po[props.lang]);
            dispatch({type: 'pi'});
            clearInterval(interval);
        }
    }

    useEffect(()=>{
        if(state.lives.length===0){
            props.socket.binary(true).emit('pingPong_dis',stringSchema.encode(props.socket.id));
            props.setApp('pingPongSpectator');
        }
    },[state.lives]);


    

    const countDown=()=>{
        function endCountdown() {
            props.socket.emit('pim');
            dispatch({type: 'lifelost'});
            setInstructions('You Missed!!');
            uiNotTurn();
        }

        function handleTimer() {
            setCountDownText(count);
            if(count === 0) {
              clearInterval(interval);
              endCountdown();
            } else {
              count--;
            }
        }
        
        let count = 2;
        interval = setInterval(function() { handleTimer(count); }, 300);
    }
      

    const uiNotTurn=()=>{
        setBgColor('black');
        setTxtColor('white');
        setCountDownText('');
    }

    const uiIsTurn=()=>{
        setBgColor('white');
        setTxtColor('black');
        setCountDownText('3');
    }
    

    useEffect(()=>{
        props.socket.on('po',()=>{
            dispatch({type: 'po'});
            countDown();
            uiIsTurn();
            setInstructions(text.pingPong.instructions.pi[props.lang]);
        });
        props.socket.on('pp_win',()=>{
            props.socket.off('po');
            props.socket.off('pi');
            clearInterval(interval);
            setInstructions('You Won!');
            uiNotTurn();
            dispatch({type: 'pi'});
        });
        // eslint-disable-next-line
    },[]);


    return(
        <div style={{minHeight:'100%',width:'100vw',backgroundColor: bgColor,color: txtColor,justifyContent:'center',alignItems:'center',display:'flex',flexDirection:'column'}}  onTouchStart={onClick}>
            <h1 style={{position:'absolute',top:20,left:20}} >{state.lives}</h1>
            <h1 >{instructions}</h1>
            <h1 style={{fontSize:'20vmin'}}>{countDownText}</h1>
        </div>
    );
}
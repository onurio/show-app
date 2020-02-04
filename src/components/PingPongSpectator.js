import React, { useEffect, useState } from 'react';
import { stringSchema,intSchema } from '../utils/packTypes';
import {hexToComplimentary } from '../utils/utils';
import text from '../utils/text';



export const PingPongSpectator=props=>{
    const [players,setPlayers] = useState('');
    const [winner,setWinner] = useState('');
    const [bgColor,setBgColor] = useState('black');
    const [fontColor,setFontColor] = useState('white');

    useEffect(()=>{
        props.socket.on('pp_win_name',(name)=>{
            name = stringSchema.decode(name);
            setWinner(`${name} ${text.pingPongSpectator.won[props.lang]}`);
        });
        props.socket.on('pp_players',(number)=>{
            setPlayers(intSchema.decode(number));
        });
        props.socket.on('pp_reset',()=>{
            props.setApp('pingPong');
        });
        props.socket.on('bg',(color)=>{
            color = stringSchema.decode(color);
            setBgColor(color);

            setFontColor(hexToComplimentary(color));
        });
        return ()=>{
            props.socket.off('pp_reset');
            props.socket.off('pp_win_name');
            props.socket.off('bg');
            props.socket.off('pp_players');
        }
    });
    return(
        <div className='main' style={{backgroundColor:bgColor,color:fontColor}} >
            <h1><span role="img" aria-label='dead'  >😵</span><br/>{text.instructions.body.pingPongSpectator[props.lang].text}</h1>
            <h2>{text.pingPongSpectator.players[props.lang]} {players}</h2>
            <h1>{winner}</h1>
        </div>
    );
}
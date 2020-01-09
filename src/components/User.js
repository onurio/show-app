import React from 'react';
import './User.css';

export const User =props=>{
    
    return(
    <div className="row" >
        <div className="row_item user_name" >{props.name}</div>
        <div className="row_item user_id">{props.id}</div>
        <div className="row_item">
            <label className="switch">
                <input type="checkbox" onChange={e=>props.changeState(props.id,e.target.checked)} />
                <span className="slider round"></span>
            </label>
        </div>
    </div>
    );
}
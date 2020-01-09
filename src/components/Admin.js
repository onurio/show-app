import React,{useEffect,useState} from 'react';
import {ADMIN_JOINED,USER_STATE_CHANGED,SEND_USER_LIST} from '../Events';
import {User} from './User';

// let userList=[];

export const Admin =props=>{
    const [users,setUsers] = useState({});
    const [userList,setUserList] = useState([]);

    useEffect(()=>{
        props.socket.emit(ADMIN_JOINED);
        props.socket.on(SEND_USER_LIST,(usersNew)=>{
            setUsers(usersNew);
            updateUserList(usersNew);
        });
        // eslint-disable-next-line
    },[props.socket]);


    const changeUserState =(id,state)=>{
        props.socket.emit(USER_STATE_CHANGED,{id:id,state:state});
    }


    const updateUserList=(users)=>{
        setUserList(Object.entries(users).map((user)=>{
            return (<User key={user[1]} changeState={changeUserState} name={user[0]} id={user[1]} />);
        }));
    }



    return(
        <div>
            <h1>Admin Page!</h1>
            {userList}
        </div>
    );
}
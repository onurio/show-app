const io = require('./index.js').io;
var sp = require('schemapack');
const {USER_JOINED,ADMIN_JOINED,MIDIIN,MAXADMIN_JOINED,USER_STATE_CHANGED,SEND_USER_LIST} = require('../Events.js');
const {midiMessageSchema} = require('../utils/packTypes');
const connectedUsers = {};
const idName={};

let counter = 0;
let idList = [];
let notes = {};
let maxAdmin;
let Admin;


let appName;

let phonePianoMode ='free';



module.exports = (socket) =>{

    socket.on(ADMIN_JOINED,()=>{
        console.log('admin joined');
        socket.join('admin');
        Admin = socket;
        socket.emit(SEND_USER_LIST,idName);
    });

    socket.on(USER_STATE_CHANGED,(state)=>{
        console.log(state);
    });

    socket.on(MAXADMIN_JOINED,()=>{
        socket.join('admin');
        maxAdmin = socket;
        console.log(`max admin ${socket.id} joined`);
    });

    socket.on(USER_JOINED,(name)=>{
        socket.name = name;
        console.log(`user ${name} has connected`);
        connectedUsers[socket.id] = socket;
        idList = [...Object.keys(connectedUsers)];
        idName[name] = socket.id;
        socket.join('general');
        // io.to('admin').emit('users',idList);
        io.to('admin').emit(SEND_USER_LIST,idName);
    });

    
    socket.on(MIDIIN,(msg)=>{
        playNotes(midiMessageSchema.decode(msg)); 
    });

    socket.on('appName',(name)=>{
        appName = name
        io.sockets.emit('app',name);
    });

    socket.on('getApp',()=>{
        io.sockets.emit('app',appName);
    });

    socket.on('phonepiano_mode',(msg)=>{
        phonePianoMode = msg;
        io.sockets.emit('phonepiano_mode',phonePianoMode);
    });

    socket.on('get_phonepiano_mode',()=>{
        socket.emit('phonepiano_mode',phonePianoMode);
    });

    
    
    socket.on('disconnect',()=>{
        if(socket.name){
            delete idName[socket.id];
            delete connectedUsers[socket.id];
            idList.findIndex((index)=>{
                idList.splice(index,1);
            });
            console.log(connectedUsers);
            io.to('superadmin').emit('users_sockets',idName);
            console.log(`user ${socket.name} disconnected`);
        }
        
    });
};

const playNotes = (note) =>{
    if(idList.length>0){ 
        if(note[1]>0){
            if(connectedUsers[idList[counter]]){
                connectedUsers[idList[counter]].binary(true).emit('noteon',midiMessageSchema.encode(note));
            }
            notes[note[0]] = idList[counter];
            counter++;
            counter = counter % idList.length;
        }else{
            if(connectedUsers[notes[note[0]]]){
                connectedUsers[notes[note[0]]].binary(true).emit('noteoff',midiMessageSchema.encode(note));
            }
            notes[note[0]] = null;

        }
    }else{
        console.log('no users connected');
    }
}
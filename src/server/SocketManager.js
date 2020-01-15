const io = require('./index.js').io;
var sp = require('schemapack');
const {USER_JOINED,ADMIN_JOINED,MIDIIN,MAXADMIN_JOINED,USER_STATE_CHANGED,SEND_USER_LIST,MIDIOUT} = require('../Events.js');
const {midiMessageSchema,stringSchema} = require('../utils/packTypes');
const connectedUsers = {};
const idName={};

let pianoCounter = 0;
let pingPongCounter = 0;
let idList = [];
let notes = {};
let maxAdmin;
let Admin;

let activePlayers = {};
let activeIdList = [];


let appName;

let phonePianoMode ='free';


module.exports = (socket) =>{

    

    socket.binaryType = 'arraybuffer';


    socket.on(ADMIN_JOINED,()=>{
        console.log('admin joined');
        socket.join('admin');
        socket.emit(SEND_USER_LIST,idName);
    });

    socket.on(USER_STATE_CHANGED,(state)=>{
        console.log(state);
    });

    socket.on(MAXADMIN_JOINED,()=>{
        socket.join('maxadmin');
        console.log(`max admin ${socket.id} joined`);
        socket.on('phonepiano_mode',(msg)=>{
            phonePianoMode = msg;
            io.sockets.emit('phonepiano_mode',phonePianoMode);
        });
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
        switch(appName){
            case 'phonePiano':
                playNotes(midiMessageSchema.decode(msg)); 
                break;
            case 'sampleTriggerer':
                if(midiMessageSchema.decode(msg)[1]>0){
                    io.sockets.binary(true).emit('noteon',midiMessageSchema.encode(msg));
                }
                break;
            default:
                return;
        }
        
    });


    socket.on('pi',()=>{
        io.to('maxadmin').emit(MIDIOUT);
        pingPong();
    });

    socket.on('pim',()=>{
        pingPong();
    });


    socket.on('pipo_start',()=>{  
        activePlayers = {...connectedUsers};  
        activeIdList = Object.keys(activePlayers);    
        pingPong();
    });


    socket.on('pipo_stop',()=>{
        console.log('stopppped');
    });

    socket.on('pingPong_dis',(id)=>{
        id = stringSchema.decode(id);
        delete activePlayers[id];
        activeIdList = Object.keys(activePlayers);
        if(activeIdList.length > 1){
            pingPongCounter =  pingPongCounter % activeIdList.length;
        }else{
            console.log(activePlayers[activeIdList[0]].name +' is the winner!');
            activePlayers[activeIdList[0]].emit('pp_win');
            io.to('general').binary(true).emit('pp_win_name',stringSchema.encode(activePlayers[activeIdList[0]].name));
            activePlayers = {...connectedUsers};  
            activeIdList = Object.keys(activePlayers);    
            pingPong();
        }
    });
    
    





    socket.on('appName',(name)=>{
        appName = name
        io.sockets.binary(true).emit('app',stringSchema.encode(name));
    });

    socket.on('getApp',()=>{
        if(appName!=undefined){
            io.sockets.binary(true).emit('app',stringSchema.encode(appName));
        }
    });



    socket.on('get_phonepiano_mode',()=>{
        socket.emit('phonepiano_mode',phonePianoMode);
    });

    
    
    socket.on('disconnect',()=>{
        if(socket.name){
            delete idName[socket.name];
            delete connectedUsers[socket.id];
            idList = [...Object.keys(connectedUsers)];
            io.to('admin').emit(SEND_USER_LIST,idName);
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
            pianoCounter++;
            pianoCounter = pianoCounter % idList.length;
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



const pingPong=()=>{
    if(activeIdList.length>1){        
        activePlayers[activeIdList[pingPongCounter]].emit('po');
        pingPongCounter++;
        pingPongCounter = pingPongCounter % activeIdList.length;
    }
}
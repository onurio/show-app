var app = require('http').createServer();
var io = module.exports.io = require('socket.io')(app);
var connectedUsers = module.exports.connectedUsers;

const PORT = process.env.PORT || 4000;
const SocketManager = require('./SocketManager.js');
console.log(PORT);
io.on('connection',SocketManager);

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}`);
});
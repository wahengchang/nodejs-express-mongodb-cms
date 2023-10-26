const socketIO = require('socket.io');

let connectedClients = {};
let io


const initSocketServer = (server) => {
    io = socketIO(server);
}

const getConnectedClients = () => {
    return connectedClients;
}

const getIo = ()   => {
    return io;
}

module.exports = {
    initSocketServer,
    getConnectedClients,
    getIo
}
const socketio = require('socket.io');

const connections = [];

let io;

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        const {tipo} = socket.handshake.query;

        connections.push({
            id:socket.id,
            tipo:tipo.split()
        });
    });
};

exports.findConnections = (tipo) => {
    return connections.filter(connection => {
        return connection.tipo.some(item => tipo.includes(item))
    });
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
};
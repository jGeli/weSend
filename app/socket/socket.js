const socketIo = require("socket.io");



let socket;

class Socket{

    static async setSocket(server){
        const io = socketIo(server, {
            path: '/api/socket',
            cors: "*"
            });
        
            socket = io;

        return socket
    }

    static getSocket(){
        require('./index')(socket);
        return socket
    }

}

module.exports = Socket;
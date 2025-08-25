const socketIo = require("socket.io");
const userModel = require('./models/userModel');
const driverModel = require('./models/driverModel');

let io;

function initializeSocket(server){
    io = socketIo(server, {
        cors : {
            origin: '*',
            methods: ['GET','POST']
        }
    });

    io.on('connection',(socket) => {
        console.log(`client connected : ${socket.id}`);
        socket.on('join',async (data) => {
            const { userId, userType } = data;
            if(userType == 'user'){
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }else if(userType == 'driver'){
                await driverModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-driver',async (data) => {
            const { userId, location } = data;

            await driverModel.findByIdAndUpdate(userId, {
                location : { 
                    ltd: location.ltd , 
                    lng: location.lng 
                }
            });
        });

        socket.on('disconnect',() => {
            console.log(`client disconnected : ${socket.id}`);
        });
    })
}

const sendMessageToSocketId = ( socketId , messageObject) => {
    console.log(messageObject);
    if(io){
        io.to(socketId).emit(messageObject.event,messageObject.data)
    }else{
        console.log('Socket.io is not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId}
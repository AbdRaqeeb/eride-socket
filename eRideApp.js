const express = require('express'),
    cors = require('cors'),
     bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 16100;
const http = require('http');
const app = express()
const server = http.createServer(app);
let io = require('socket.io')(server);
const Socket = require('./socket/handler')(io);
const {Notify} = require('./pushnotifications')

app.use(cors())

app.get('/home',(req, res) =>{
    Notify(0,12,123, 'Ride has started', 'Notification about the ride', 90)
    //     type, rideId, driverId, title, body, receiver
    res.status(200).json({error: false, message:'Run and run'})
});

server.listen(PORT, console.log(`Server running on ${PORT}`));


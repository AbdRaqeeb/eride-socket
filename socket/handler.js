const express = require('express')
const router = express.Router();
const path = require('path');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const axios = require('axios');
const mysql = require('mysql');
const {Notify} = require('../pushnotifications');



let options = {
    url: 'https://easydispatch.ng/api/v1/user_balance',
    json: { Authorization: 'd4ddd2cd8c8ff3acdcdce8fee0130c01' }

};
let connection;


function *makeRequrst(){
    
}

//User                                  Driver
//on -> requestRide                          onrequestRide,  emit  -> rideAccepted
//                                                           emit -> deleteRequest
//on rideAccepted
//                                       show enroute:  emit driverArrived

//                                                      emit startTrip
//on startTrip( show enroute)
//

module.exports = async io => {

    let newTrip ='trip-';

    let r = Math.random().toString(36).substring(7);
    console.log("random", r);

    io.on('connection', function (socket) {

        let users = [];
        let driversId =[];
        let requestmaker ={}





        socket.on('requestRide', async function (user) {

            // socket.join(newTrip + user.id)

            // console.log('>>>>>>>>>>>>>>>>>>>>>>user token', user.data)
            requestmaker = user;
            console.log('The USer Object: ', user.data);
           const config = {
            headers: { Authorization:user.data.token }
        };

         
        return  axios.post('http://ride.everythingeasyng.com/api/request/trip',user.data,config)
       .then(async response =>{

        let thisTrip = newTrip + response.data.trip_info.id;
       

        await socket.join(thisTrip, function() {
        
            console.log("*******************************roommy Socket now in rooms", socket.rooms);
          });

       response.data.nearby_drivers.map(user =>{
           console.log('User id:  ', user.driver_id)
           driversId.push(user.driver_id)
          
       })
       io.emit('requestRide', JSON.stringify({ error: false, driverArray:driversId, tripInfo: response.data.trip_info }));


    })
    .catch(err =>{
     //   console.log(err)
        console.log(err.response)

    })
    //io.emit('payTrip', JSON.stringify({ error: false, message:'Greeting to you' }));

            //Emit create trip event
            //On accept trip, Emmit accept trip to the accepted user
            //emmit ridepicked to the rest of the rider
            //create a ride with the new user

         //   io.to(user.apiKey).emit('gb', JSON.stringify({ balance: result[0].credit }))            

    });
    // socket.on('rideRequest', function(user){

    // })
    
    socket.on('rideRequestAccepted', function (driverDetails) {
        //make api call to bind ride and user

        let createdTrip = newTrip + driverDetails.data.trip_id
        console.log('===>>: ', driverDetails.data.trip_id)
        console.log('===>>: ', driverDetails.data.driver_id)

        io.emit('requestUnavailable')
        const config = {
            headers: { Authorization:driverDetails.data.token }
        };
        console.log('This token: ', driverDetails.data.token)

        let driversData={
            driver_id: driverDetails.driverId,
            trip_id: driverDetails.trip_id
        };

        return  axios.put(`http://ride.everythingeasyng.com/api/accept/trip/${driverDetails.data.trip_id}`, { driver_id:driverDetails.data.driver_id}, config)
        .then(async response =>{
            console.log('1=1=1=1=1=1=1=1=1=1=1=1=1=1=1=1=1=1=1=1=:::::This response id: ', response.data)

        // await socket.join('trip-' + response.data.trip.id, function() {
        
        //     console.log("*******************************roommy Socket now in rooms", socket.rooms);
        //   });
        // console.log('=====This created trip: ', createdTrip)
        // io.sockets.in('trip-'+response.data.trip.id).emit('rideRequestAccepted', JSON.stringify({message:'Request accepted', tripDetails: response.data.trip  }));
     
      io.emit('rideRequestAccepted', JSON.stringify({message:'Request accepted', tripDetails: response.data  }));

                let roster = io.sockets.clients('trip-'+response.data.trip.id);

                roster.forEach(function(client) {

                    console.log('MMMMMMMMMMM   : ' + client.nickname);
                });


       console.log('All ================== the trips i created: ', io.sockets.in(createdTrip))

    })
    .catch(err =>{
       // console.log(err.response.data)
        console.log(err.response)

    })

        
                   
    });

    socket.on('driverArrived', function(driverData){

        const config = {
            headers: { Authorization:driverData.data.token }
        };


        //Driver has arrived
        return  axios.put(`http://ride.everythingeasyng.com/api/arrived/trip/${driverData.data.trip_id}`, { driver_id:driverData.data.driver_id}, config)
        .then(response =>{
            console.log('+++1', response)
            console.log('+++2', response.data)


      //  console.log('+++3', response.data.trip)
        Notify(0,12,123, 'Ride has started', 'Notification about the ride', response.data.user_id)

       io.emit('driverArrived', JSON.stringify({message:'Request accepted', tripDetails: response.data  }));


    })
    .catch(err =>{
        console.log(err.response.data)
        console.log(err.response)

         })
    });

    socket.on('startTrip', function(driverData) {
        const config = {
            headers: { Authorization:driverData.data.token }
        };


        return  axios.put(`http://ride.everythingeasyng.com/api/start/trip/${driverData.data.trip_id}`, { driver_id:driverData.data.driver_id}, config)
        .then(response =>{
        console.log('++T====>+', response.data)
        Notify(1,12,123, response.data.status, 'Notification about the ride', response.data.user_id)
         io.emit('tripStarted', JSON.stringify({message:'Request accepted', tripDetails: response.data  }));
        
        })
    .catch(err =>{
       // console.log(err.response)
        console.log(err.response)

    })
    });

    socket.on('cancelTripDriver', function(driverData) {

        console.log('Attempt to cancel Trip', driverData);

        const config = {
            headers: { Authorization:driverData.data.token }
        };


        return  axios.put(`http://ride.everythingeasyng.com/api/driver/cancel/trip/${driverData.data.trip_id}`, { driver_id:driverData.data.driver_id}, config)
        .then(response =>{
        console.log('++T====>+', response.data)
        Notify(1,12,123, response.data.status, 'Notification about the ride', response.data.user_id)
         io.to(driverData.user_id).emit('tripCancelledByDriver', JSON.stringify({message:'Request accepted', tripDetails: response.data  }));
        
        })
    .catch(err =>{
        console.log(err.response)

      })
    });

    socket.on('cancelTripUser', function(userData) {

        console.log('Attempt to cancel Trip By User', userData);

        const config = {
            headers: { Authorization:userData.data.token }
        };


        return  axios.put(`http://ride.everythingeasyng.com/api/user/cancel/trip/${userData.data.trip_id}`, { driver_id:userData.data.driver_id}, config)
        .then(response =>{
        console.log('++T====>+', response.data)
        Notify(1,12,123, response.data.status, 'Notification about the ride', response.data.driver_id)
         io.to(userData.driver_id).emit('tripCancelledByUser', JSON.stringify({message:'Request cancelled', tripDetails: response.data  }));
        
        })
    .catch(err =>{
        console.log(err.response)

      })
    });

    socket.on('cancelTripUser', function(driverData) {
        const config = {
            headers: { Authorization:driverData.data.token }
        };


        return  axios.put(`http://ride.everythingeasyng.com/api/user/cancel/trip/${driverData.data.trip_id}`, { driver_id:driverData.data.driver_id}, config)
        .then(response =>{
        console.log('++T====>+', response.data)
        Notify(1,12,123, response.data.status, 'Notification about the ride', response.data.user_id)
         io.emit('tripCancelledByUser', JSON.stringify({message:'Request accepted', tripDetails: response.data  }));
        
        })
    .catch(err =>{
        console.log(err.response)
      })
    });

    socket.on('tripCompleted', function(driverData) {
        const config = {
            headers: { Authorization:driverData.data.token }
        };

        console.log('The object of the completed: ', driverData)
        let arrivedObject ={}
        arrivedObject.time_taken_min =driverData.time_taken_min,
        arrivedObject.dist_covered_mile = driverData.dist_covered_mile,
        arrivedObject.user_id = driverData.user_id,
        arrivedObject.trip_id = driverData.trip_id


        console.log('The data driver parsed: ', arrivedObject.data)


        return  axios.put(`http://ride.everythingeasyng.com/api/end/trip/${driverData.data.trip_id}`, driverData.data, config)
        .then(response =>{
        console.log('++T====>+', response.data)
        Notify(1,12,123, response.data.status, 'Notification about the ride', response.data.user_id)
         io.emit('tripCompletedByDriver', JSON.stringify({message:'Request accepted', tripDetails: response.data  }));
        
        })
    .catch(err =>{
        console.log(err.response)

      })
    })

    


    socket.on('rideCancelled', function(details){
        io.to(requestmaker.id).emit('rideCancelled', JSON.stringify({message:'Ride cancelled', details:details}))
    })



    socket.on('getTripStatus', function(userData) {
        const config = {
            headers: { Authorization:userData.data.token }
        };


        return  axios.get(`http://ride.everythingeasyng.com/api/user/current/trip`, config)
        .then(response =>{
        console.log('++T====>+', response.data)
       // Notify(1,12,123, response.data.status, 'Notification about the ride', response.data.user_id)
         io.emit('getTripStatus', JSON.stringify({message:'Trip Status', tripDetails: response.data  }));
        
        })
    .catch(err =>{
       // console.log(err.response)
        console.log(err.response)

    })
    })


       



        socket.on('breakTrip', function (user) {
            
        });


        socket.on('jest', function (msg) {


        });


        socket.on('testmessage', function (data, callback) {
        let responseData = {
            string1: 'I like ',
            string2: 'bananas ',
            string3: ' dude!',
            yoursocketId:socket.id
        };
        
        callback(responseData);
    });

    });
}
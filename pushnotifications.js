let admin = require("firebase-admin")
const express = require('express')
const router = express.Router();
const axios = require('axios')



const sendPushToEndpont = (title, body, receiver) =>{ 
    const headers = {
         'Content-Type': 'application/json',
          Authorization: 'key=AIzaSyBaGyikYfnoo54Ak4prDdhLbhqXILkJjvY'
    }

    let payload = {
        notification: {
            title: title,
            body:body,
        },
        data:'call me',
        topic: ''+receiver
    }
    axios.post('https://fcm.googleapis.com/fcm/send',{
    "to": "/topics/"+receiver, 
    "notification" : {
    "body" : ''+body,
    "click_action":"FLUTTER_NOTIFICATION_CLICK",
    "content_available" : true,
    "priority" : "high",
    "title" : ''+title
    },
    "collapse_key" : "type_a",
    "data" : {
        "transaction":title
    
    }
},{
    headers: headers
  }).then(res =>{
      if(res){
          res.status(200).json({error: false,message:'posted'})
      }
  }).catch(err =>{
      console.log(err.response)
  })
}
const sendPushToEndpontDriver = (title, body, receiver) =>{ 
    const headers = {
  'Content-Type': 'application/json',
  Authorization: 'key=AIzaSyBaGyikYfnoo54Ak4prDdhLbhqXILkJjvY'
}

    let payload = {
    notification: {
        title: title,
        body:body,
    },
    data:'call me',
    topic: ''+receiver
}
    axios.post('https://fcm.googleapis.com/fcm/send',{
    "to": "/topics/"+receiver, 
    "notification" : {
    "body" : ''+body,
    "click_action":"FLUTTER_NOTIFICATION_CLICK",
    "content_available" : true,
    "priority" : "high",
    "title" : ''+title
    },
    "collapse_key" : "type_a",
    "data" : {
        "transaction":title
    
    }
},{
    headers: headers
  }).then(res =>{
      if(res){
          res.status(200).json({error: false,message:'posted'})
      }
  }).catch(err =>{
      console.log(err.response)
  })
}
const sendPushToEndpontDriverWithData = (type,orderId,restaurantId, title, body, receiver) =>{ 
    const headers = {
  'Content-Type': 'application/json',
  Authorization: 'key=AIzaSyBaGyikYfnoo54Ak4prDdhLbhqXILkJjvY'

}

    let payload = {
    notification: {
        title: title,
        body:body,
    },
    data:'call me',
    topic: ''+receiver
}
    axios.post('https://fcm.googleapis.com/fcm/send',{
    "to": "/topics/"+receiver, 
    "notification" : {
    "body" : ''+body,
    "click_action":"FLUTTER_NOTIFICATION_CLICK",
    "content_available" : true,
    "priority" : "high",
    "title" : ''+title
    },
    "collapse_key" : "type_a",
    "data" : {
        "type":type,
        'order_id':orderId,
        'restaurant_id': restaurantId,
        "transaction":title
    
    }
},{
    headers: headers
  }).then(res =>{
      if(res){
          res.status(200).json({error: false,message:'posted'})
      }
  }).catch(err =>{
      console.log(err.response)
  })
}




const Notify = (type,rideId,driverId, title, body, receiver) =>{ 
    const headers = {
  'Content-Type': 'application/json',
  Authorization: 'key=AIzaSyBaGyikYfnoo54Ak4prDdhLbhqXILkJjvY'

}

    let payload = {
    notification: {
        title: title,
        body:body,
    },
    data:'call me',
    topic: ''+receiver
}
    axios.post('https://fcm.googleapis.com/fcm/send',{
    "to": "/topics/"+receiver, 
    "notification" : {
    "body" : ''+body,
    "click_action":"FLUTTER_NOTIFICATION_CLICK",
    "content_available" : true,
    "priority" : "high",
    "title" : title
    },
    "collapse_key" : "type_a",
    "data" : {
        "type":type,
        'ride_id':rideId,
        'restaurant_id': driverId,
        "transaction":title
    
    }
},{
    headers: headers
  }).then(res =>{
      if(res){
          res.status(200).json({error: false,message:'posted'})
      }
  }).catch(err =>{
      console.log(err.response)
  })
}

module.exports = {sendPushToEndpont,sendPushToEndpontDriver,sendPushToEndpontDriverWithData,Notify};


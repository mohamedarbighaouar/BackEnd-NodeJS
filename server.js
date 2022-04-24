var app = require('./app');
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);
const notificationController = require('../skillspacenodejs/controller/notificationController')

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Express server listening on port ' + port);
});

httpServer.listen(3003, function () {
  console.log('Socket server listening on port ' + 3003);
});


let users_joined_socket = []


io.sockets.on('connection', function (socket) {

  socket.on("join", function (message) {

    let new_user = { userid: message.userid, socketid: socket.id }

    if (users_joined_socket.includes(new_user) == false) {

      users_joined_socket.push(new_user)
    
    }

  })

  
  socket.on("message", function (message) {

    let receiver = users_joined_socket.filter(e => e.userid == message.to)
    let sender = users_joined_socket.filter(e => e.userid == message.from)

    const queryString = "insert into messages(sender,receiver,content,created_at) values(?,?,?,CURRENT_TIMESTAMP)"

    pool.query(queryString, [message.from, message.to, message.message], (err, rows, fields) => {

      if (!err)
      {
        if (receiver.length > 0) {
    
          socket.to(receiver[0].socketid).emit("messageReceived", message)
          console.log(receiver[0].userid)
          let notif = { topic:"user_"+receiver[0].userid,title:"SkillSpace",body:"Vous avez reçu un nouveau message"}
          notificationController.sendNotificationToTopic(notif)
        
        }
      }
    })
  })

  socket.on("disconnect", function (message) {

    console.log("disconnected", message.userid)
    users_joined_socket = users_joined_socket.filter(e => e.userid != message.userid)
    console.log("new array", users_joined_socket)

  })


})




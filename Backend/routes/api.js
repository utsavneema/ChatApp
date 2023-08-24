const express = require("express");
// const expressWs = require("express-ws");
// const WebSocket = require("ws");
const router = express.Router();
const dotenv= require('dotenv');
const mysql = require("mysql");
const moment = require("moment");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const ExcelJs = require('exceljs');
const jwt = require ('jsonwebtoken')
const jwtKey = 'hello';
const cors = require('cors');
const http = require("http");


const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try {
      const parsedMessage = JSON.parse(message);

      
      if (parsedMessage.imageUrl && parsedMessage.sender) {
        // console.log('Received image message from', parsedMessage.sender);
      }else if(parsedMessage.videoUrl && parsedMessage.sender){
        console.log('Received video message from', parsedMessage.sender);
      } 
      else if(parsedMessage.audioUrl && parsedMessage.sender){
        console.log('Received audio message from', parsedMessage.sender);
      } 
      else if (parsedMessage.text && parsedMessage.sender) {
        
        // console.log('Received plain text message from', parsedMessage.sender, ':', parsedMessage.text);
      }

      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
});




const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

function dbSelect(sql, param) {
  return new Promise((resolve) => {
    try {
      con.query(
        sql,
        param,
        function (error, result) {
          if (error) throw error;
          return resolve(result);
        });
    } catch (error) {
      return resolve(result);
    }
  })
}

function dbInsert(sql, params) {
  return new Promise((resolve, reject) => {
    con.query(
      sql, 
      params, 
      (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function dbDelete(sql, params) {
  return new Promise((resolve, reject) => {
    con.query(
      sql, 
      params, 
      (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}


router.post("/register", async function (req, res, next) {
  const name = _.get(req, "body.name");
  const email = _.get(req, "body.email");
  const password = _.get(req, "body.password");

  try {
    let existingSql = 'select id from users where email =?'
    let existingUser = await dbSelect(`${existingSql}`, [email]);
    if (existingUser.length >0) {
        return res.status(401).json({status: false, error: "already exists"})
    }

    let sql = "insert into users (name, email, password) values (?, ?, ?)";
    const user = await dbInsert(`${sql}`, [name, email, password]);
    return res.status(200).json({ status:true, message: "user inserted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to insert user" });
  }
});
//----------------------------------------------------------------------------------------------------------------------

router.post("/login", async function (req, res, next) {
  const email = _.get(req, "body.email");
  const password = _.get(req, "body.password");

  try {
    let sql = "SELECT * FROM users WHERE email = ? AND password = ?"; 
    const user = await dbSelect(sql, [email, password]);

    if (user.length === 0) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user[0].id}, jwtKey);

    return res.status(200).json({ status: true, token: token, user: user[0] }); 
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to perform login" });
  }
});
//************************************************************************************************* */
async function authMiddleWare(req, res, next) {
  try {
    const token = _.get(req, 'headers.authorization', ''); 
    // console.log(token, 'tokennnnnnn');

    if (!token) {
      return res.status(401).json("token nahi mila"); 
    } else {
      const decodedToken = jwt.verify(token, jwtKey);
      // console.log(decodedToken, "decoded");
      
      let sql = 'SELECT * FROM users WHERE id = ?'; 
      const users = await dbSelect(sql, [decodedToken.id]);
      // console.log(users, "========================");

      const user = users[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newUser = { ...user, password:undefined };
      // console.log(newUser);
      req.userDetails = newUser; 
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json("Invalid token."); 
  }
}
//----------------------------------------------------------------------------------------------------------
router.get('/auth', authMiddleWare, (req, res) => {
  const userDetails = req.userDetails; 
  // console.log(userDetails);
  return res.json({ status: true, userDetails });
});
//---------------------------------------------------------------------------------------------------------
router.get("/user-list", authMiddleWare, async function (req, res, next) {
  try {
    const loggedInUser = req.userDetails; 
    const sql = "SELECT * FROM users WHERE id != ?"; 
    const userDetails = await dbSelect(sql, [loggedInUser.id]);

    return res.status(200).json({ status: true, userDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to fetch user list" });
  }
});

//*************************************************************************************************************** */
router.get("/room-details", authMiddleWare, async function (req, res, next) {
  try {
    const currentUserID = req.userDetails.id;
    console.log(currentUserID, "------------------------------");
    const sql = `SELECT DISTINCT users.id, users.name, users.email, users.password FROM chat_room JOIN users ON (users.id = chat_room.sender_id OR users.id = chat_room.receiver_id) WHERE (chat_room.sender_id = ? OR chat_room.receiver_id = ?) AND users.id != ?;`;
    const roomDetails = await dbSelect(sql, [currentUserID, currentUserID, currentUserID]);

    return res.status(200).json({ status: true, roomDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to fetch room details" });
  }
});
//*************************************************************************************************************************** */
router.post("/upload-video", function (req, res, next) {
  const file1 = _.get(req, "files.userfile");
  const videoName = parseInt(Math.random() * 100000);
  const path = videoName;
  file1.mv("./public/videos/" + videoName);
  return res.status(200).json({ status: true, message: "success", file1, path });
});

//************************************************************************************************************************ */
router.post("/upload-audio", function (req, res, next) {
  const file1 = _.get(req, "files.audiofile");
  const audioName = parseInt(Math.random() * 100000);
  const path = audioName;
  file1.mv("./public/audios/" + audioName);
  return res.status(200).json({ status: true, message: "success", file1, path });
});

//******************************************************************************************************************************* */
router.post("/chats", async function (req, res, next) {
  const senderId = _.get(req, "body.senderId");
  const receiverId = _.get(req, "body.receiverId");
  const message = _.get(req, "body.message");
  const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
  const imageUrl = _.get(req, "body.imageUrl")
  // console.log(receiverId);

  try {
    let sql = 'select id from chat_room where sender_id = ? and receiver_id = ?';
    const existingRoom = await dbSelect(sql, [senderId, receiverId]);

    let chatRoomId;

    if (existingRoom.length > 0) {
      chatRoomId = existingRoom[0].id;
    } else {
      sql = "insert into chat_room (sender_id, receiver_id, created_at) values (?,?,?)";
      const chatRoom = await dbInsert(sql, [senderId, receiverId, created_at]);
      chatRoomId = chatRoom.insertId;
    }

    sql = "insert into message (sender_id, receiver_id, room_id, text, created_at, image) values (?,?,?,?,?,?)";
    const messageResult = await dbInsert(sql, [senderId, receiverId, chatRoomId, message, created_at, imageUrl]);

    const messageId = messageResult.insertId;

    return res.status(200).json({ status: true, chatRoomId, messageId, message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: "Failed to update Room" });
  }
});
//******************************************************************************************************************* */
module.exports = router;

const port = 8000;
server.listen(port, () => console.log(`Listening on port: 8000`));

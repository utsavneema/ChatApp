var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


// function dbSelect(sql, param) {
//   return new Promise((resolve) => {
//     try {
//       con.query(
//         sql,
//         param,
//         function (error, result) {
//           if (error) throw error;
//           return resolve(result);
//         });
//     } catch (error) {
//       return resolve(result);
//     }
//   })
// }

// function dbInsert(sql, params) {
//   return new Promise((resolve, reject) => {
//     con.query(
//       sql, 
//       params, 
//       (error, result) => {
//       if (error) {
//         console.error(error);
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }

// function dbDelete(sql, params) {
//   return new Promise((resolve, reject) => {
//     con.query(
//       sql, 
//       params, 
//       (error, result) => {
//       if (error) {
//         console.error(error);
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "proj1",
// });

// con.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//     return;
//   }
//   console.log("Connected to the database!");
// });

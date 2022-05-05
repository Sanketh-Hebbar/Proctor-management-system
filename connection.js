const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database: "miniproject",
    port : 3306
  });

con.connect((err) => {
    if(err) throw err;
    console.log("connection created..!!");

});

module.exports.con=con;
const mysql = require('mysql2');
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "smit199",
    database: "test"
});

conn.connect((err) => {
    if(err) {
        console.log("error in connection");
        throw err;
    }
    console.log("successfully connected with database");
    const sql = "CREATE TABLE users (userid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), age VARCHAR(3), mobileno VARCHAR(10), emailid VARCHAR(255), password VARCHAR(255))";
    conn.query(sql, (err) => {
        if(err) {
            console.log("error in executing query");
            throw err;
        }
        console.log("table created successfully");
    });
});
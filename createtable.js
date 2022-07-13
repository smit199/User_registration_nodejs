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
    const sql = "CREATE TABLE users (userid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, age VARCHAR(3) NOT NULL, mobileno VARCHAR(10) NOT NULL UNIQUE, emailid VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)";
    conn.query(sql, (err) => {
        if(err) {
            console.log("error in executing query");
            throw err;
        }
        console.log("table created successfully");
    });
});
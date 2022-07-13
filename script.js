const express = require('express');
const app = express();
const path = require("path");
const qs = require("querystring");

const mysql = require('mysql2');
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "smit199",
    database: "test"
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.post('/registerUser', (req, res) => {
    
    let body = '';
    req.on('data', (data) => body += data);
    req.on('end', () => {
        console.log(body);
        let post = qs.parse(body);
        
        conn.connect((err) => {
            if(err) throw err;
            console.log("successfully connected");
            res.writeHead(200, {'Content-Type': 'text/html'});
            const sql = `INSERT INTO users VALUES (null, '${post.fname}', '${post.age}', '${post.mobile}', '${post.mail}', '${post.pwd}')`;
            conn.query(sql, (err) => {
                if(err) {
                    console.log("unable to register");
                    res.end('<html><body><h1>Registration unsuccessful.</h1><br><p>User already exist with your mobile no. or email id. Try with different mobile no or email id</p><a href="/register">Back to register</a></body></html>');
                    throw err;
                }
                res.end('<html><body><h1>Registration successful.</h1><br><a href="/login">login here</a></body></html>');
                console.log("1 user registered");
            });
        });
    });
});

app.post('/loginUser', (req, res) => {
    let body = '';
    req.on('data', (data) => body += data);
    req.on('end', () => {
        let post = qs.parse(body);
        
        conn.connect((err) => {
            if(err) throw err;
            console.log("successfully connected");
            res.writeHead(200, {'Content-Type': 'text/html'});
            const sql = `SELECT * FROM users WHERE (mobileno='${post.username}' OR emailid='${post.username}') AND password='${post.pwd}'`;
            conn.query(sql, (err, result) => {
                if(err) {
                    console.log("error happened");
                    res.end('<html><body><h1>Login unsuccessful.</h1><br><p>error at server side</p><a href="/login">Back to login</a></body></html>')
                    throw err;
                }
                else if(result.length===0) {
                    console.log("invalid user")
                    res.end('<html><body><h1>Login unsuccessful.</h1><br><p>Username or password is incorrect</p><a href="/login">Try again</a></body></html>');
                }
                else {
                    let msg = `<html><body><h1>Welcome ${result[0].name} in our website</h1><br><p>your profile details are:</p><br>`;
                    for(let key in result[0]) {
                        msg += `<p>${key}: ${result[0][key]}`;
                    }
                    msg += "</body></html>";
                    res.end(msg);
                    console.log(`${result[0].name} logged in`);
                }
            });
        });
    });
});

app.listen(3000);
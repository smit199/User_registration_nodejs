const express = require('express');
const app = express();
const path = require("path");
const bodyparser = require("body-parser");
const session = require('express-session');
const methodOverride = require('method-override');
const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "smit199",
    database: "test"
});
let user;

app.use(session({secret: 'sessionsecretkey',saveUninitialized: true,resave: true}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
    if(req.query._method) return req.query._method;
  }));

app.use(methodOverride((req) => {
    if(req.query._method) return req.query._method;
}, { methods: ["GET"] }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.get('/changePassword', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/password.html'));
});

app.post('/registerUser', (req, res) => {
    
    let post = req.body;
        
    conn.connect((err) => {

        if(err) throw err;
        console.log("successfully connected");
        res.writeHead(200, {'Content-Type': 'text/html'});
        const sql = `INSERT INTO users VALUES (null, '${post.fname}', '${post.age}', '${post.mobile}', '${post.mail}', '${post.pwd}')`;

        conn.query(sql, (err) => {
            if(err) {
                console.log("unable to register");
                res.end('<html><body><h1>Registration unsuccessful.</h1><br><p>User already exist with your mobile no. or email id. Try with different mobile no or email id</p><a href="/register">Back to register</a></body></html>');
                console.log(err);
            }
            res.end('<html><body><h1>Registration successful.</h1><br><a href="/login">login here</a></body></html>');
                console.log("1 user registered");
        });
    });
});

app.post('/loginUser', (req, res) => {
        
    let post = req.body;
        
    conn.connect((err) => {
        if(err) throw err;
        console.log("successfully connected");
        res.writeHead(200, {'Content-Type': 'text/html'});
        const sql = `SELECT * FROM users WHERE (mobileno='${post.username}' OR emailid='${post.username}') AND password='${post.pwd}'`;
        
        conn.query(sql, (err, result) => {
                
            if(err) {
                console.log("error happened");
                res.end('<html><body><h1>Login unsuccessful.</h1><br><p>error at server side</p><a href="/login">Back to login</a></body></html>')
                console.log(err);
            }
            else if(result.length===0) {
                console.log("invalid user");
                res.end('<html><body><h1>Login unsuccessful.</h1><br><p>Username or password is incorrect</p><a href="/login">Try again</a></body></html>');
            }
            else {
                user = req.session;
                user.uid = result[0].userid;
                console.log(user.uid);
                let msg = `<html><body><h1>Welcome ${result[0].name} in our website</h1><br><p>your profile details are:</p><br>`;
                for(let key in result[0]) {
                    msg += `<p>${key}: ${result[0][key]}</p>`;
                }
                msg += `<br><br><a href='/changePassword'>Change Password</a><br><br>`;
                msg += `<a href='/logout'>Logout</a><br><br><a href='/deleteUser?_method=delete'>Delete Account</a></body></html>`;

                res.end(msg);
                console.log(`${result[0].name} logged in`);
            }
        });
    });
});

app.put('/updatePassword', (req, res) => {
    if(user.uid) {
        
        let put = req.body;

            conn.connect((err) => {
                if(err) throw err;
                res.writeHead(200, {'Content-Type': 'text/html'});
                const sql = `UPDATE users SET password='${put.newpwd}' WHERE userid='${user.uid}'`;
                
                conn.query(sql, (err) => {                      
                    if(err) {
                        console.log("error in updation of password");
                        res.end('<html><body><h1>error in updating password</h1><br><a href="/changePassword">Try Again</a></body></html>')
                        console.log(err);
                    }
                    else {
                        let msg = `<html><body><h1>Password changed successfully</h1><br><!--<a href='/loginUser'>Back to profile page</a>--></body></html>`;
                        res.end(msg);
                    }
                });
            });    
    }
    else {
        res.end("You are not logged in. login first to change password.");
    }
});

app.get('/logout', (req, res) => {
    if(user.uid) {
        req.session.destroy((err) => {
            if(err) {
                console.log(err);
            }    
            res.redirect('/');
        });
    }
    else
        res.end("invalid url");
});

app.delete('/deleteUser', (req, res) => {
    if(user.uid) {
        conn.connect((err) => {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            const sql = `DELETE FROM users WHERE userid='${user.uid}'`;
    
            conn.query(sql, (err) => {
                if(err) {
                    console.log("unable to delete user");
                    res.end("error in deleting account");
                    console.log(err);
                }
                res.end("<html><body><h1>your account is now deleted</h1><br><br><a href='/'>Back to home page</a></body></html>");
                console.log("1 user deleted");
            });
        });
    }
    else {
        res.end("invalid url");
    }
});

app.listen(3000);
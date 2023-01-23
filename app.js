/**
 * @Yilin Yao
 * 2023/1/5
 * This file is for managing the database and deal with the request that 
 * web.js will make to the server. 
 */
"use strict";

const express = require('express');
const app = express();
const SERVER_NUMBER = 8000;
const multer = require("multer");
const USER_ERROR = 400;
const SERVER_ERROR = 500;
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const TABLE_NAME_PREFIX = "table_";
var cors = require('cors')
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(multer().none());

/**
 * a post requrest that user can make on requesting a new account in the databse
 * test passed
 */
app.post('/user/create', async (req, res) =>{
    try {
        res.type('text');
        let username = req.body.username;
        let password = req.body.password;
        console.log("create input username: " + username);
        console.log("create input password: " + password);
        if (!username || !password || username == undefined || password == undefined) {
            res.status(USER_ERROR);
            res.send('Missing one or more of the required params. ');
        }
        // TODO when the database structure changed, change this also. 
        const sql = 'INSERT INTO Username_and_Password VALUES (null, ?, ?)';
        let db = await getDBConnection();
        let respond = await db.run(sql, [username, password]);
        if (!respond) {
            res.status(USER_ERROR);
            throw new Error('Create Failed');
        }
        res.type('text').send('Created');
    } catch (e) {
        console.log("creating error: \n" + e);
        throw_server_error(res);
    }
})

/**
 * given the username, check if the username exist
 * test needed
 */
app.post('/user/exist', async (req, res) => {
    try {
        let username = req.body.username;
        let db = await getDBConnection();
        let sql = "SELECT COUNT(*) FROM Username_and_Password WHERE username=?";
        let respond = await db.all(sql, [username]);
        console.log('User search for: ' + username);
        console.log('User exist result: ' + respond[0]['COUNT(*)']);
        if (respond[0]['COUNT(*)'] == 0) {
            res.type('text').send('do not exist');
            return;
        }
        res.type('text').send('exist');
    } catch(err) {
        throw_server_error(res);
    }
})


/**
 * given the username and password, return ture or false
 */
app.post('/user/login_attampt', async (req, res) => {
    let err_message = 'Server Databse Error';
    try {
        let username = req.body.username;
        let password = req.body.password;
        let db = await getDBConnection();
        let sql = "SELECT password FROM Username_and_Password WHERE username = ?";
        let respond = await db.all(sql, [username]);
        console.log(respond[0].password);
        err_message = 'Inccorect Password!'; 
        if (!safe_string_equal(password, respond[0].password)) {
            res.type('text').send(err_message);
            return;
        } 
        res.type('text').send('Passed');
    } catch(err) {
        res.type('text').send(err_message);// TODO catch all errors with changing the error code
    }
})

function safe_string_equal (str1, str2) {
    let ret = true;
    for (let i = 0; i < str1.length; i++) {
        if (str1.toString().charAt(i) != str2.toString().charAt(i)) {
            ret = false;
        }
    }
    return ret;
}

/**
 * given the property name and property value, update the related sql table
 * test needed
 * TODO change the structure of the database to the JSON file supoorted version
 */
app.post('/user/update_status', async (req, res) => {
    try {
        let username = req.body.username;
        let properties = req.body.properties;
        if (!username || !properties) {
            res.static(USER_ERROR);
            res.send("Missing one ore more of the required params. ");
        } 
        let sql = "UPDATE ? SET ? = ? WHERE username=?";
        for(let i = 0; i < properties.length; i++) {
            await db.all(sql, [
                TABLE_NAME_PREFIX + properties[i],
                properties[i],
                username
            ]);
        }
        res.type('text').send('Succesed');
    } catch(e) {
        throw_server_error(res);
    }
    
})

/**
 * given the username, a property name, return the property value of the user. 
 * test needed
 */
app.get('/user/get_status', async (req, res) => {
    try {
        let username = req.query.username;
        let properties = req.query.properties; 
        if (!username || !properties) {
            res.static(USER_ERROR);
            res.send("Missing one ore more of the required params. ");
        }
        let sql = "SELECT ? FROM ? WHERE username=?";
        let db = await getDBConnection();
        let respond = {};
        for(let i = 0; i < properties.length; i++) {
            respond.properties[i] = (await db.all(sql, [
                properties[i],
                TABLE_NAME_PREFIX + properties[i], 
                username
            ]));
        }
        res.json();
    } catch(e) {
        throw_server_error(res);
    }
})

/**
 * given the respond element, return an error text. 
 * @param {*} res 
 */
function throw_server_error(res) {
    res.status(SERVER_ERROR).type('text').send('An Error Occured, Please Try Again');
}

/**
 * Establishes a databse connection to the databses and returns the database
 * object.
 * Any Errors that occur should be caught in the function that called this one.
 * @returns {Object} - the database object for the connection.
 */
async function getDBConnection() {
    const db = await sqlite.open({
        filename: "reccoon.db",
        driver: sqlite3.Database
    });
    return db;
}


app.use(express.static('public'));
const PORT = process.env.PORT || SERVER_NUMBER;
app.listen(PORT);


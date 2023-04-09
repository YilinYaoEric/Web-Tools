/**
 * @Yilin Yao
 * 2023/1/5
 * This file is for managing the database and deal with the request that 
 * web.js will make to the server. 
 */

const express = require('express');
const app = express();
const SERVER_NUMBER = 8000;
const multer = require("multer");
const USER_ERROR = 400;
const SERVER_ERROR = 500;
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
var cors = require('cors')
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(multer().none());


/**
 * a post requrest that user can make on requesting a new account in the databse
 * create user if not exist and return Created
 * else return Exist
 * throw an error if username and password is not given propertly
 * params: 
 *  username
 *  password
 *  data(optional)
 * TODO add salt
 * Test passed
 */
app.post('/user/create', async (req, res) =>{
    try {
        res.type('text');
        let { username, password, data } = req.body;
        let db = await getDBConnection(); 

        const [passed, exist] = await user_exist(username, db);        
        if (!passed) {
            throw new Error("searching for user failed");
        }

        if (exist){
            console.log("username exist for " + username);
            res.type('text').send("Exist");
            return;
        }

        console.log("create input username: " + username);
        console.log("create input password: " + password);

        if (!username || !password) {
            res.status(USER_ERROR);
            res.send('Missing one or more of the required params. ');
            return;
        }

        let salt = generateSalt();
        const sql = 'INSERT INTO Username_and_Password VALUES (null, ?, ?, ?, ?)';
        const respond = await db.run(sql, [username, password, salt, data ? data : '[{"id":0,"page":0}]']);
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

// return a pair [bool, bool] representing the sql secuessed and if the user exist
// Test passed
async function user_exist(username, db) {
    try {
        if (username.includes(" ")) {
            return [1, 1]
        }
        let sql = "SELECT COUNT(*) FROM Username_and_Password WHERE username=?";
        let respond = await db.all(sql, [username]);
        console.log("searching for user respond = " + respond.keys());
        respond = respond[0]['COUNT(*)']
        console.log("respond: " + respond)
        if (respond > 0) {
            return [1, 1];
        }
        return [1, 0]
    } catch(e) {
        return [0, 0]
    }
}

/**
 * given the username and password, return ture or false
 */
app.post('/user/login_attampt', async (req, res) => {
    let err_message = 'Server Databse Error';
    try {
        let username = req.body.username;
        let password = req.body.password;
        let db = await getDBConnection();

        const [passed, exist] = await user_exist(username, db);        
        if (!passed) {
            throw new Error("searching for user failed");
        }
        if (!exist){
            res.type('text').send("Username do not exist");
            return;
        }

        err_message = 'Inccorect Password!'; 
        if (!await check_user_idenentity(username, password, db)) {
            res.type('text').send(err_message);
            return
        }
        res.type('text').send('Passed');
    } catch(err) {
        res.type('text').send(err_message); // TODO catch all errors with changing the error code
    }
})

async function check_user_idenentity(username, password, db) {
    let sql = "SELECT password FROM Username_and_Password WHERE username = ?";
    let respond = await db.all(sql, [username]);
    console.log("requesting username: " + username)
    console.log("requesting password: " + password)
    console.log("storaged password: " + respond[0].password)
    console.log(safe_string_equal(password, respond[0].password))
    return safe_string_equal(password, respond[0].password)
}


function safe_string_equal (str1, str2) {
    for (let i = 0; i < str1.length; i++) {
        if (str1.toString().charAt(i) !== str2.toString().charAt(i)) {
            return false
        }
    }
    return str1.length === str2.length;
}

/**
 * given the property name and property value, update the related sql table
 * test needed
 * TODO change the structure of the database to the JSON file supoorted version
 */
app.post('/user/update_status', async (req, res) => {
    try {
        let { username, properties, password } = req.body;
        if (!username || !properties || !password) {
            res.static(USER_ERROR);
            res.send("Missing one ore more of the required params. ");
        }
        let sql = "UPDATE Username_and_Password SET data = ? WHERE username=? AND password=?";
        let db = await getDBConnection();
        if (!await check_user_idenentity(username, password, db)) {
            res.type('text').send('Failed')
            return
        }
        await db.all(sql, [properties, username, password])
        res.type('text').send('Succesed');
    } catch(e) {
        throw_server_error(res);
    }
})


// Update the password of the given username and password
app.post('/user/update_password', async (req, res) => {
    try {
        let { username, properties, password } = req.body;
        if (!username || !properties || !password) {
            res.static(USER_ERROR);
            res.send("Missing one ore more of the required params. ");
        }
        let sql = "UPDATE Username_and_Password SET password = ? WHERE username=? AND password=?";
        let db = await getDBConnection();
        if (!await check_user_idenentity(username, password, db)) {
            res.type('text').send('Failed')
            return
        }
        await db.all(sql, [properties, username, password])
        res.type('text').send('Succesed');
    } catch(e) {
        throw_server_error(res);
    }
})


/**
 * given the username, a property name, return the property value of the user. 
 * test needed
 */
app.get('/user/:username/:password', async (req, res) => {
    try {
        let { username, password } = req.params;
        console.log(username)
        if (!username || !password) {
            res.static(USER_ERROR);
            res.send("Missing one ore more of the required params. ");
        }
        let sql = "SELECT data FROM Username_and_Password WHERE username=? AND password=?";
        let db = await getDBConnection();
        let ret = (await db.all(sql, [username, password]));
        console.log(ret)
        res.send(ret[0].data);
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

function generateSalt(length) {
    let salt = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        salt += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return salt;
}

app.use(express.static('public'));
const PORT = process.env.PORT || SERVER_NUMBER;
app.listen(PORT);

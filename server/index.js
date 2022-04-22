const express = require('express');
const app = express();
const routes = require('./routes/routes.js');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const cors = require('cors');
const path = require('path');

app.use(myconn(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'pruebaimg'
}))
app.set('port', 4000);
app.use(cors());


const dominioB = 'http://localhost:3000';
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    res.header('Access-Control-Allow-Headers',
     'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Acces-Control-Allow-Request-Method');
    res.header({"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"});
    next();
});
app.use(routes);
app.use(express.static(path.join(__dirname, 'dbimages')))
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
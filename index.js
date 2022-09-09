const express = require('express');
const path = require('path');
require('dotenv').config();

const {dbconnection} = require('./database/config')
dbconnection();

const app = express();
// parseo de json
app.use(express.json());

const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// routes
app.use('/api', require('./routes/auth'));

server.listen(process.env.PORT, (err) => {
  if (err) throw new Error(err);
  console.log('Servidor corriendo en puerto:', process.env.PORT);
})
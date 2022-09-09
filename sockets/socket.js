const {io} = require('../index');


io.on('connection', client => {
  console.log('Cliente conectado');

  client.on('disconnect', client => {
    console.log('Cliente desconectado');
  });

  
});

const mongoose = require('mongoose');

const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN)
    console.log('BD online');

  } catch (err) {
    console.log(err);
    throw new Error('Error en la base de datos - Hable con el admin');
  }
}

module.exports = {
  dbconnection
}
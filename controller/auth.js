const { response } = require("express")
const bcrypt = require('bcryptjs');

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");


const registerUser = async (req, res = response) => {
  const {email, password} = req.body;

  const existEmail = await User.findOne({ email });
  if (existEmail) return res.status(400).json({
    ok: false,
    msg: 'El correo ya esta registrado',
  });

  try {    
    const user = new User(req.body)
    // encriptar password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save()

    // generar JWT
    const token = await generateJWT(user._id);
  
    res.json({ok: true, user, token})
  } catch (err) {
    console.log(err);
    res.status(500).json({ok: false, msg: 'Hable con el administrador'})
  }
}

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
    
  try {
    const existUser = await User.findOne({ email });
    if ( !existUser ) return res.status(404).json({
      ok: false,
      msg: 'Email o contraseña invalidos'
    });

    const validPassword = await bcrypt.compareSync(password, existUser.password);
    if ( !validPassword ) return res.status(404).json({
      ok: false,
      msg: 'Email o contraseña invalidos'
    });

    // generar token
    const token = await generateJWT(existUser._id);

    res.json({ok: true, user: existUser, token})

  } catch (err) {
    console.log(err);
    return res.status(500).json({ok: false, msg: 'Hable con el administrador'});
  }
}

const renewToken = async ( req, res = response ) => {
  const uid = req.uid;
  
  try {
    const user = await User.findById(uid);
    
    if(!user) return res.status(404).json({
      ok: false,
      msg: 'No existe el usuario o el uid es invalido'
    });

    // generar nuevo token
    const token = await generateJWT(uid);

    res.json({
      ok: true,
      user,
      token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ok: false, msg: 'Error en el servidor'})
  }
  
}

module.exports = {
  registerUser,
  loginUser,
  renewToken
}
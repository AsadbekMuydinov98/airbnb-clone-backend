const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
function vala(req, res){
  console.log('salom');
}

async function userRegister(req, res) {
  mongoose.connect(process.env.MONGO_URL);
  const {name,email,password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
    console.log(e);
  }
}


// app.post('/register', async (req,res) => {
  

// });

async function userLogin(req, res) {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
}

// app.post('/login', async (req,res) => {
  
// });

async function userProfile(req, res) {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
}

// app.get('/profile', (req,res) => {
  
// });

async function logout(req, res) {
  res.cookie('token', '').json(true);
}

// app.post('/logout', (req,res) => {
//   res.cookie('token', '').json(true);
// });

module.exports = {
  userRegister,
  userLogin,
  userProfile,
  logout,
  vala,
}
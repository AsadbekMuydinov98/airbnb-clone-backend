const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');
const appRouter = require('./router.js')
const jwt = require('jsonwebtoken');
const imageDownloader = require('image-downloader');
const fs = require('fs');
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
const app = express()
const multer = require('multer');
const Place = require('./place/place.model.js')

require('dotenv').config();

// app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(express.json())
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
  // origin: 'https://airbnb-clone-bymory.netlify.app',
}));

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  try {
    await imageDownloader.image({
      url: link,
      dest: '../../uploads/' + newName, // Save images to the uploads directory
    });
    res.json(newName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to download and save the image' });
  }
});

// app.post('/upload-by-link', async (req,res) => {
//   const {link} = req.body;
//   const newName = 'photo' + Date.now() + '.jpg';
//   await imageDownloader.image({
//     url: link,
//     dest: __dirname +'/uploads/' +newName,
//   });
//   res.json(newName);
// });

const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = req.files.map(file => '/uploads/' + file.filename);
  res.json(uploadedFiles);
});
// app.post('/upload', photosMiddleware.array('photos', 100), async (req,res) => {
//   const uploadedFiles = [];
//   for (let i = 0; i < req.files.length; i++) {
//     const {path,originalname} = req.files[i];
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     const newPath = path + '.' + ext;
//     fs.renameSync(path, newPath)
//     uploadedFiles.push(newPath.slice(8));
//   }
//   res.json(uploadedFiles);
// });

app.post('/places', async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;
    const {
      title, address, addedPhotos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner: userData.id, price,
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests,
      });
      res.json(placeDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create a new place' });
  }
});

// app.post('/places', (req,res) => {
//   mongoose.connect(process.env.MONGO_URL);
//   const {token} = req.cookies;
//   const {
//     title,address,addedPhotos,description,price,
//     perks,extraInfo,checkIn,checkOut,maxGuests,
//   } = req.body;
//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     if (err) throw err;
//     const placeDoc = await Place.create({
//       owner:userData.id,price,
//       title,address,photos:addedPhotos,description,
//       perks,extraInfo,checkIn,checkOut,maxGuests,
//     });
//     res.json(placeDoc);
//   });
// });



const port = process.env.PORT
app.use('/', appRouter)

app.listen(port, ()=>{
  console.log('connected', port);
})

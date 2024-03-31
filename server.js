const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan')
require('dotenv').config();
var mongoose=require('mongoose');

console.log(process.env.MONGODB_URI)
//connect to the DB
const connectToDatabase = async () => {
    try {
      const connection = await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected successfully');
      console.log('Database Name:', connection.connections[0].name);
    } catch (error) {
      console.error('Connection error', error);
    }
  };
  connectToDatabase();



// CORS Headers => Required for cross-origin/ cross-server communication
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, PUT, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});



app.use(morgan('dev'))
// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
// form-urlencoded

// for parsing multipart/form-data
//app.use(upload.array());

//app.use('/uploads',express.static('uploads'))

//seting up express server!
app.use(express.json())

const con = require('./routes/F_user_details');
app.use('/customer', con);


app.get('*', function (req, res) {
    res.send('404 not found');
});

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT }`));

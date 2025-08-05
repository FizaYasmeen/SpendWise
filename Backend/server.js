const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('./config/connectDB')

//config dot env file
dotenv.config();

//database call
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//routes
app.get('/',(req, res) => {
    res.send( '<h1> Hello from server</h1>')
});

//port
const PORT = 8080 || process.env.PORT

//listen server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

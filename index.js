const express = require ('express');
// const {client}= require('./db/index/')
require('dotenv').config()
const PORT = 3000;
// this is morgan my middleware that is giving me responses based on information
const morgan = require('morgan')

const app= express();
app.use(express.json());
app.use(express.urlencoded ({extended:false}));
app.use(morgan('dev'));
const apiRouter = require('./routes');

app.use('/api',apiRouter);

const { client } = require('./db');
client.connect();

app.listen(PORT,()=>{
    console.log('we are up and running on port 3000')
})

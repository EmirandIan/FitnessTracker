const express = require ('express');
const {client }= require('./db/index/')

const app= express();

client.connect();

app.listen(3000,()=>{
    console.log('we are up and running on port 3000')
})
const express = require('express');
const { getAllUsers,getUserByUsername, getUser, createUser } = require('../db/users');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;


usersRouter.get('/',async(req,res,next)=>{
  try{
    const users = await getAllUsers();
    res.send({users})
  } catch(error){
    console.log(error);
  }
})

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");
  
    next(); // THIS IS DIFFERENT
  });
  
  // login
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }
  
  try {
    const user = await getUser(username,password);
    console.log("this is my user obj", user);
    if (user && user.password == password) {
      // create token & return to user
    const token = jwt.sign({ username: username, id: user.id}
      , JWT_SECRET,{
      expiresIn:"1w"})
      req.user = user;
      res.send({ message: "you're logged in!", token });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});


usersRouter.post('/register', async (req, res, next) => {
  const { username, password} = req.body;

  try {
   
    const user = await createUser({
      username,
      password
    });

    const token = jwt.sign({ 
      id: user.id, 
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({ 
      message: "thank you for signing up",
      token 
    });
  } catch (error) {
    console.log(error)
  } 
});
module.exports = usersRouter;
const express = require('express');
const activitiesRouter = express.Router();
const {requireUser} = require("./utils");

console.log(1);
const { 
    createActivity,
    getAllActivities,
    updateActivity,
} = require("../db/activities")
const{
  getRoutineActivityById
} = require("../db/activities")


activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
console.log(3)
  try {
    const id = req.params;
    const routine = await getRoutineActivityById(id);
    if (routine.length === 0)
      res.send({
        message: `Activity ${id} not found`,
        name: 'Activity not found Error',
        error: 'Activity dose not  exist',
    });
        res.send({routine});
    } catch (error) {
        next(error);
    }
});
 


console.log(2)
activitiesRouter.get('/', async (req, res) => {
  const activities = await getAllActivities();
  res.send({ activities });
});
  activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, description, } = req.body;
    //const activities 
    const activity = await createActivity(activityData);
    
    const activityData = { name, description };
    try {
    if  (!activity) {
      next({
        name: "ErrorGettingActivities",
        message: "Activity does not exist",
      });
    }
        res.send(activity);
      } catch (error) {
        next(error);
      }
  });
         
  activitiesRouter.patch('/:activityId', async (req, res, next) => {
        const { activityId } = req.params;
        const { name, description } = req.body;
      
        const updateFields = {};

        if (name) {
          updateFields.name = name;
        }
      
        if (description) {
          updateFields.description = description;
        }
        try {
          if (req.user) {
            const updatedActivity = await updateActivity(activityId, updateFields);
            res.send({ activity: updatedActivity });
          } else {
            next({
              name: "UserNotLoggedIn",
              message: "Login to update activity",
            });
          }
        } catch ({ name, description }) {
          next({ name, description });
        }
      });
  
    

  module.exports = activitiesRouter;

  
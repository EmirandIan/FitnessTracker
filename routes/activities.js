const express = require('express');
const router = express.Router();
const activitiesRouter = express.Router;



const { 
    createActivity,
    getAllActivities,
    getRoutineActivityById,
    updateActivity,
} = require("../db/activities")


activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    try {
        const id = req.params.activityId;
        const activity = { id: id };
        const routine = await getRoutineActivityById(activity);
        if (routine.length === 0)
          res.send({
            message: `Activity ${id} not found`,
           name: 'Activity not found Error',
           error: 'Activity dose not  exist',
          });
        
        
            res.send({ routine });
          } catch ({ name, message }) {
            next({ name, message });
          }
        });
 
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
  
    

module.exports = router;

  
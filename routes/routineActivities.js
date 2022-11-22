const express = require('express');
const routineActivitiesRouter = express.Router();
const {
    getRoutineActivityById,
    getRoutineById,
    updateRoutineActivity,
    destroyRoutineActivity,
  } = require("../db");
const {requireUser} = require("./utils");

// PATCH /api/routine_activities/:routineActivityId
    

// DELETE /api/routine_activities/:routineActivityId


routineActivitiesRouter.patch('/:routineActivityId', async (req, res, next) => {
    const { count, duration } = req.body;
    const id = req.params.routineActivityId;
    try {
      const routineActivity = await getRoutineActivityById(id);
      const routine = await getRoutineById(routineActivity.routineId);
      if (req.user.id !== routine.creatorId) {
        next({ name: "Must be a user" });
      } else {
        const updatedRoutineAct = await updateRoutineActivity({
          id,
          count,
          duration,
        });
        if (updatedRoutineAct) {
          res.send(updatedRoutineAct);
        } else {
          next({ name: "Routine does not exist" });
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

routineActivitiesRouter.delete("/:routineActivityId", async (req, res, next) => {
    const { routineActivityId } = req.params;
    try {
      const routineActivity = await getRoutineActivityById(routineActivityId);
      const routine = await getRoutineById(routineActivity.routineId);
      
        if (req.user.id === routine.creatorId) {
         const destroyActivity = await destroyRoutineActivity(routineActivityId);
         res.send(destroyActivity);
     } else {
         next({ message: "Error: Only the creator can delete a routine"});
         }
     } catch ({ message }) {
       next({ message });
     }
     }
)

module.exports = routineActivitiesRouter;
const express = require('express');
const routinesRouter = express.Router();
const {requireUser} = require('./utils')

const {
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivityById,
} = require("../db/routines");

// GET /api/routines

// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities


routinesRouter.get("/", async (req, res) => {
  const allRoutines = await getAllPublicRoutines();
  
  res.send(
    allRoutines);
});
   console.log("the real error")
routinesRouter.post("/", requireUser, async (req, res, next) => {
  console.log("error")
  const { name, goal, isPublic = "" } = req.body;
  const createNewRoutine = {};
  try {
    createNewRoutine.creatorId = req.user.id;
    createNewRoutine.name = name;
    createNewRoutine.goal = goal;
    createNewRoutine.isPublic = isPublic;
    const routine = await createRoutine(createNewRoutine);
    res.send(routine);
  } catch ( error ) {
    console.log("no good",error)
    next( error );
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { name, goal, isPublic } = req.body;
  try {
    const id = req.params.routineId;
    const originalRoutine = await getRoutineById(routineId);
    if (req.user.id != originalRoutine.creatorId) {
      res.status(403);
      next({
        name: "RoutineUpdateError",
        message: `User ${req.user.username} is not allowed to update ${originalRoutine.name}`,

      });
    } else {
      const updatedRoutine = await updateRoutine({
        id: id,
        name,
        goal,
        isPublic,
      });
      res.send(updatedRoutine);
    }
    
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.get('/:username/routines', async (req, res, next) => {
  const {username} = req.params;
  try{
    const userRoutines = await getPublicRoutinesByUser(username);
    if(!username) {
      next({
        username: "username does not exist",
        routines: "public routines do not exist",
        message: "There are no public routines for this user"
      });
      res.send(userRoutines)
    }
  } catch ({message}) {
    return (username)
  }
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const id = req.params.routineId;
  try {
    const routine = await getRoutineById(id);
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "UnauthorizedUserError",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    } else {
      await destroyRoutine(routine.id);
      res.send(routine);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.post("/:routineId/activities", requireUser, async (req, res, next) => {
    const { activityId, duration, count } = req.body;
    const { routineId } = req.params;
    const routineActId = await getRoutineActivityById(activityId);
    try {
      if (routineActId) {
        next({
          name: "IdError",
          message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
        });
      } else {
        const addedActivity = await addActivityToRoutine({
          routineId,
          activityId,
          duration,
          count,
        });
        res.send(addedActivity);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);
module.exports = routinesRouter;


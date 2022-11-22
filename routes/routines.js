const express = require('express');
const routinesRouter = express.Router();

// GET /api/routines

// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities
routinesRouter.get('/', async (req, res, next) => {
    try {
      const allRoutines = await getAllRoutines();
  
      const routines = allRoutines.filter(post => {
        // the post is active, doesn't matter who it belongs to
        if (post.active) {
          return true;
        }
      
        // the post is not active, but it belogs to the current user
        if (req.user && post.author.id === req.user.id) {
          return true;
        }
      
        // none of the above are true
        return false;
      });
    
      res.send({
        posts
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  
module.exports = routinesRouter;
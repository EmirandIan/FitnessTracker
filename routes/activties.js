const express = require('express');
const router = express.Router();

// GET /api/activities/:activityId/routines

// GET /api/activities

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;

activityRouter.get('/', async (req, res, next) => {
    try {
      const allPosts = await getAllActivities();
  
      const posts = allPosts.filter(post => {
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
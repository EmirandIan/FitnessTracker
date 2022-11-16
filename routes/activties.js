const express = require('express');
const router = express.Router();
const activitiesRouter = express.Router;

// GET /api/activities/:activityId/routines     NEED WORK

// GET /api/activities      done/editing

// POST /api/activities     done/editing

// PATCH /api/activities/:activityId    NEED WORK

const { 
    createActivity,
    getAllActivities,
    getActivityById
} = require("../db/activities")

// INCOMPLETE
// activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
//     try {
//         const activity = await getActivityById();

//         activity = getActivityById.filter(activity => {
//             if (activity.active) {
//                 return true;
//             }
//             if (req.user && req.user.id === activity.author.id) {
//                 return true;
//               }
        
//               return false;
//             })
        
//             res.send({ activity });
//           } catch ({ name, message }) {
//             next({ name, message });
//           }
//         });
        
activitiesRouter.get('/', async (req, res, next) => {
    try {
      const activities = await getAllActivities();
  
        activities = getAllActivities.filter(post => {
        // the post is active, doesn't matter who it belongs to
        if (activities.active) {
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

  activityRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
  
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};
  
    if (tagArr.length) {
      postData.tags = tagArr;
    }
  
    try {
      postData.authorId = req.user.id;
      postData.title = title;
      postData.content = content;
  
      const post = await createActivity(postData);
  
      if (post) {
        res.send(post);
      } else {
        next({
          name: 'PostCreationError',
          message: 'There was an error creating your Activity.'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  activitiesRouter.patch('/:activityId', async (req, res, next) => {
        const { activityId } = req.params;
        const { id, name, description } = req.body;
      
        const updateFields = {};
      
        try { 
          const newActivity = await updateActivity(id,name,description);
          console.log("this is good"+newActivity)
        } catch ({ name, description }) {
          next({ name, description });
        }
      });
  
    

  module.exports = router;
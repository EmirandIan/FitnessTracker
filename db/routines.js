const{client} = require('./index')
const{getUserByUsername} = require('./users');
const{getActivityById} = require('./activities');
async function createRoutine({
    creatorId,isPublic,name,goal
}){
    try{
        const { rows: [routine] }= await client.query(`
        INSERT INTO routines("creatorId","isPublic",name,goal)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (name) DO NOTHING
        RETURNING*;
        `,[creatorId,isPublic,name,goal]);
        return routine;
    }catch(error){
        console.log(error)
    }
}

async function updateRoutine({
    id, isPublic,name,goal
}){ console.log("updating routine " + "")
    try{
        const {rows: [routine]} = await client.query(`
        UPDATE routines SET "isPublic"=$1, name=$2, goal=$3
        WHERE id=${id}
        RETURNING *`,[isPublic,name,goal])
        console.log("routineUpdate")
        return routine
    }catch(error){
        console.log(error)
    }
}

async function destroyRoutine(id){
    // console.log("destroying id by name"  + )
    try{
        console.log("destroying routine #" + id)
        await client.query(`
        DELETE FROM routines WHERE id =${id}`)
        console.log(id + " routine destroyed");
    } catch(error){
        console.log(error);
    }
}

async function attachActivitiesToRoutines(routines) {
    // no side effects
    const routinesToReturn = [...routines];
    const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
    const routineIds = routines.map(routine => routine.id);
    if (!routineIds?.length) return [];
    
    try {
      // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
      const { rows: activities } = await client.query(`
        SELECT activities.*, "routineActivities".duration, "routineActivities".count, "routineActivities".id AS "routineActivityId", "routineActivities"."routineId"
        FROM activities 
        JOIN "routineActivities" ON "routineActivities"."activityId" = activities.id
        WHERE "routineActivities"."routineId" IN (${ binds });
      `, routineIds);
  
      // loop over the routines
      for(const routine of routinesToReturn) {
        // filter the activities to only include those that have this routineId
        const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
        // attach the activities to each single routine
        routine.activities = activitiesToAdd;
      }
      return routinesToReturn;
    } catch (error) {
      throw error;
    }
}

async function getAllRoutines() {
  try {
    console.log("getting all routines")
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error
  }
}

async function getRoutineById(routineId){
    console.log("getting user by id");
    try{
        if(!routineId){
            console.log("there is no routineId") 
            return null 
        }
        const { rows: [routine] } = await client.query(`
        SELECT * FROM routines WHERE id=${ routineId }
        `);
        console.log(routine, " routine info")
        return routine;
    } catch(error){
        console.log(error);
    }
}

async function getRoutineByName(routName){
    try{
        console.log("getting routine by name" , routName)
        const { rows } = await client.query(`
        SELECT * FROM routines
        WHERE name=$1;
        `,[routName]);
        console.log("routine acquired!" , rows);
        return rows;
    }catch(error){
        console.log(error);
    }
}

//You should be able to get routine by user and then display 
// the activities that are linked to it in routineactivities

async function getRoutineByUser(userId){
    try{
        console.log("getting routine by user")
        const{ rows: [ routine ] }= await client.query(`
        SELECT * FROM routines
        WHERE "creatorId"=${userId}
        ;`)
        console.log(routine)
        return routine
    }catch(error){
        console.log(error)
    }
}

async function getAllPublicRoutines(){
    try{
        console.log("getting all public routines")
        const{ rows: routine }= await client.query(`
        SELECT * FROM routines 
        WHERE "isPublic" = true;
        `)
        console.log(routine)
        return attachActivitiesToRoutines(routine)
    }catch(error){
        console.log(error);
    }
}

async function getPublicRoutinesByUser(user){
    try{
        const userObj = await getUserByUsername(user);
        console.log("getting public routines by user ", userObj)
        const{ rows} = await client.query(`
        SELECT * FROM routines 
        WHERE "isPublic" = true AND
        "creatorId" =${userObj.id};
        `)
        console.log("user " , user ,"'s public routines" ,rows)
        return rows;
    } catch(error){
        console.log(error)
    }
}
// async function getPublicRoutinesByActivity(activityId){
//     console.log("getting public routines by activity")
//     try{
//         const routineId = await get
//         console.log("getting routine By activityid" , activityId)
//         const{ rows=[ routine ] }= await client.query(`
//         SELECT * FROM routines
//         WHERE "isPublic" = true AND
//         "activityId" =${activityId}
//         `)
//         console.log()
//         return routine;
//     }catch(error){
//         console.log(error);
//     }

// }

async function getPublicRoutinesByActivity({ id }) {
    try{
      const {rows: id}=await client.query (`
      SELECT activity FROM routines
      WHERE activity=${id};
      `)
      const activity =await Promise.all (id.map(
        activity=> getPublicRoutinesByActivity(activity.id)
      ));
  return activity;
  }catch(error){
    console.log(error);
    }
  }

async function getRoutinesWithoutActivities(){
    try{
        const{ rows: [ routine ] }= await client.query(`
        SELECT * FROM routines;`)
        return routine;
    } catch(error){
        console.log(error);
    }
}




module.exports= {
    createRoutine,
    updateRoutine,
    destroyRoutine,
    getAllRoutines,
    getRoutineById,
    getRoutineByName,
    getRoutineByUser,
    getAllPublicRoutines,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    getRoutinesWithoutActivities
}


const{client} = require('./index')

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
        const routineUpdate = await client.query(`
        UPDATE routines SET "isPublic"=$1, name=$2, goal=$3
        WHERE id=${id}`,[isPublic,name,goal])
        console.log("routineUpdate")
        return routineUpdate
    }catch(error){
        console.log(error)
    }
}

async function destroyRoutine(id){
    // console.log("destroying id by name"  + )
}

async function getAllRoutines(){
    console.log("getting all routines")
    try{
        const { rows } = await client.query(`
        SELECT routines.*, "routineActivities".*, activities.* AS activity
        FROM routines
        JOIN "routineActivities" ON routines.id = "routineActivities"."routineId"
        JOIN activities ON activities.id = "routineActivities"."activityId"
        GROUP BY activities.id, routines.id, "routineActivities".id;
        `);
        // const { rows }= await client.query(`
        // SELECT activities.*`)
        console.log(rows);
        return rows;
    }catch(error){
        console.log(error);
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
        SELECT name FROM routines WHERE id=${ routineId }
        `);
        
        return routine;
    } catch(error){
        console.log(error);
    }
}

async function getRoutineByName(routName){
    try{
        const { rows: [name] } = await client.query(`
        SELECT * FROM routine
        WHERE name = $1;
        `,[routName]);
        return name;
    }catch(error){
        console.log(error);
    }
}

//You should be able to get routine by user and then display 
// the activities that are linked to it in routineactivities

async function getRoutineByUser(userName){
    try{
        // const { rows: [] }
    }catch(error){
        console.log(error)
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
    // destroyRoutine,
    getAllRoutines,
    getRoutineById,
    getRoutineByName,
    getRoutineByUser,
    // getAllPublicRoutines,
    // getPublicRoutinesByUser,
    // getPublicRoutinesByActivity,
    getRoutinesWithoutActivities
}


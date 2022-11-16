const{client} = require('./index');
async function addActivityToRoutine({
    routineId,activityId,duration,count
}){
    try{
        const { rows: [routineActivity] }= await client.query(`
        INSERT INTO "routineActivities"("routineId","activityId",duration,count)
        VALUES ($1,$2,$3,$4)
        RETURNING*;
        `,[routineId,activityId,duration,count]);
        return routineActivity;
    }catch(error){
        console.log(error);
    }
}

async function getRoutineActivityById(id){
    try{
        console.log("getting routine activity by id")
        const { rows: [routineActivity] } = await client.query(`
        SELECT * FROM routineActivities
        WHERE id =$1;
        `,[id]);

        if(!routineActivity){
            throw{
                name:"routineActivity not found",
                message:"could not find routineActivity with that id"
            }
        }
        console.log("routineActivity found")
    } catch(error){
        console.log(error);
    }
}


// Unfinished update patch command
// async function updateRoutineActivity({ id, count, duration}){
//     console.log("patching routine activity...")
//     try{
//         const 
//     }
// }

async function destroyRoutineActivity(id){
    console.log("attempting to delete number " + id + "from routine activities")
    try{
    await client.query(`
        DELETE FROM routineActivities
        WHERE id =${id}`)
    console.log("Deleted routine number " + id);
    }catch(error){
        console.log(error);
    }
}

async function getRoutineActivitiesByRoutine(routine){
    console.log("attempting to get routineActivities by routine name " + routine);
    try{
        const { rows: [routineActivity]} = await client.query(`
        SELECT FROM routineActivities
        WHERE routine =$1
        `,[routine]);
        return routineActivity;
    } catch(error){
        console.log(error);
    }
}

module.exports={
    addActivityToRoutine,
    getRoutineActivityById,
    // updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
};
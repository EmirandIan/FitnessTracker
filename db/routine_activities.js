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
        SELECT * FROM "routineActivities"
        WHERE id =$1;
        `,[id]);

        if(!routineActivity){
            throw{
                name:"routineActivity not found",
                message:"could not find routineActivity with that id"
            }
        }
        // console.log("routineActivity found" + Object.keys(routineActivity))
        // console.log("routineActivity found" + routineActivity.count)
        return routineActivity
    } catch(error){
        console.log(error);
    }
}


// Unfinished update patch command (maybe return to this one)
// updateroutineActivity should be thought of as id, fields{duration, count}
// think of this function as NEEDING an id but allowing you to change either duration count or both. 
async function updateRoutineActivity(id, fields={})
    {
    const setString = Object.keys(fields).map(
        //interpolated insert that allows the method chain to send an object value into sql
        (key, index) => `"${ key }"=$${ index + 1}`
        ).join(', ');
    if (setString.length === 0){
        console.log("failure")
        return;
    }
    console.log("patching routine activity..."  + id)
    try{
        const { rows: [routine] } = await client.query(`
        UPDATE "routineActivities" SET ${setString}
        WHERE id=${id} RETURNING*;
        `, Object.values(fields));

        console.log(routine);
        console.log("patched routineActivity " + id)
        return routine;
    } catch(error){
        console.log(error)
    }
}

async function destroyRoutineActivity(id){
    console.log("attempting to delete number " + id + "from routine activities")
    try{
    await client.query(`
        DELETE FROM "routineActivities"
        WHERE id =${id}`)
    console.log("Deleted routine Activity number " + id);
    }catch(error){
        console.log(error);
    }
}

async function getRoutineActivitiesByRoutine(id){
    console.log("attempting to get routineActivities by routine id " + id);
    try{
        const { rows: [routineActivity]} = await client.query(`
        SELECT * FROM "routineActivities"
        WHERE id =${id};
        `);
        console.log("this is routine activity   " +Object.keys(routineActivity))
        return routineActivity;
    } catch(error){
        console.log(error);
    }
}

module.exports={
    addActivityToRoutine,
    getRoutineActivityById,
    updateRoutineActivity, //unfinished
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
};

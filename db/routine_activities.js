const{client} = require('./index');
async function createRoutineActivities({
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

module.exports={
    createRoutineActivities
};
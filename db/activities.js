const{client} = require('./index')


async function createActivity({
    name, description
}){
    console.log("activity " +name+ " being created")
    try{
        const { rows: [ activity ] } = await client.query(`
        INSERT INTO activities(name, description)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING*;
        `,[name, description]);
        return activity;
    } catch(error){
        console.log(error)
        
    }
}

async function getAllActivities(){
    try{
        console.log("getting all activities....")
    const { rows } = await client.query(
        `SELECT * from activities;`
    )
    console.log(rows);
    return rows;
    }catch(error){
        console.log(error);
    }
}

async function getActivityById(id){
    console.log("getting activity by id "  + id );
    try{
        if(!id){
            return null
        }
        const{ rows: [activity] } = await client.query(`
        SELECT * FROM activities
        WHERE id=${id};
        `);
        console.log("activity gotten " + activity)
        return activity;
    }catch(error){
        console.log(error);
    }
}

async function updateActivity({
    id,name,description }){
    console.log("updating activity by id" + id)
    try{
        if(!id){
            return null
        }
            const{ rows: [activity] } = await client.query(`
            UPDATE activities SET name=$1, description=$2
            WHERE id=${id}`,[name,description])
            console.log("Activity "+ id, "changed to ", name," ", description) 
    } catch(error){
        console.log(error)
    }
}

module.exports= {
    createActivity,
    getAllActivities,
    getActivityById,
    updateActivity
}
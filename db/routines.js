const{client} = require('./index')

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

module.exports= {
    createRoutine,
    getRoutineById,
    getRoutineByName
}


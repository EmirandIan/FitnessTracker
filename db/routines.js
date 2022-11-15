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

module.exports= {
    createRoutine
}


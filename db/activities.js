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

module.exports= {
    createActivity
}
const { client } = require(".");

async function getUserByUsername({
    username, 
}){
    console.log("getting user...")
    try{
        const { rows: [ user ] } = await client.query(`
        SELECT * FROM users
        WHERE username = $1;
        `,[username]);
        console.log("user getto")
        return user;
    } catch(error){
        console.log("there was an error getting the user...")
        throw error;
    }
}
async function getUserById({
    id
}){
    console.log("calling getUserByID...")
    try{
        if (!id){
            return null
        }
        const { rows: [ user ] } = await client.query(`
            SELECT * FROM users WHERE id=${id}
            `);
        return user;
    } catch(error){
        console.log("error with get user by id");
    }
}


async function createUser({
    username,
    password,
}){
    //password hasher?
    // saltyMeter = 7;
    // const hashedPassword = await bcrypt.hash(password,saltyMeter)
    try{
        const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING*;
        `,[username, password]);
        return user;
    }catch(error){
        console.log("User creation failed! WAH BABY PHAROH WANTS MILK WAH")
    }
}

async function getUser(
    username,password
){
    console.log("getting user...")
    try{
        const { rows } = await client.query(`
        SELECT * FROM users 
        WHERE username =$1;
        `,[username])
        console.log(rows);
        if(rows.username == username && rows.password == password ) return user
        else{return "user and or password incorrect!"};
    } catch(error){
        console.log(error);
    }
}

module.exports= {
    createUser,
    getUserById,
    getUserByUsername,
    getUser
}
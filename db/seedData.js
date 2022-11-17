//create a bunch of functions that fill out the database
const{client} = require('./index');
const{ createUser, getUserById
    ,getUserByUsername, getUser } = require('./users');
const{createActivity} = require('./activities');
const{createRoutine,getAllRoutines,updateRoutine } = require('./routines');
const{
    addActivityToRoutine, getRoutineActivityById,
    destroyRoutineActivity, getRoutineActivitiesByRoutine, updateRoutineActivity
        } = require('./routine_activities');

async function dropTables(){
    console.log("┻━┻︵ \(°□°)/ ︵ ┻━┻ flipping all tables... ")
    try{
        await client.query(`
        DROP TABLE IF EXISTS "routineActivities";
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS users;
        `);

        console.log("Tables have been flipped!!!(╯°□°)╯︵ ʞooqǝɔɐℲ")
    }catch(error){
        console.log(error);
        console.error("Tables did not drop effectively ╯°Д°)╯︵/(.□ . \)")
    }
}

async function createTables(){
    console.log("┳━┳ ヽ(ಠل͜ಠ)ﾉ creating tables for fitness-dev...")
    try{
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        CREATE TABLE activities(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
        );
        CREATE TABLE routines(
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users(id),
            "isPublic" BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT NOT NULL
        );
        CREATE TABLE "routineActivities"(
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER REFERENCES routines(id),
            "activityId" INTEGER REFERENCES activities(id),
            duration INTEGER,
            count INTEGER,
            UNIQUE("routineId","activityId")
        )`)
        console.log("┬─┬ノ( º _ ºノ)...success building tables!!!!")
    } catch(error){
        console.log(error);
        console.log("failure creating tables눈_눈")
    }
}

async function createInitialUsers(){
    try{
        console.log("creating inital users");
        const elonsSpring = await createUser({username: 'X Æ A-12 Musk', password: 'X Æ A-12 Musk'});
        const kimKanye = await createUser({username: 'North West', password:'I hate my dad'});
        const kanyeKim = await createUser({username: 'Psalm West', password:'Saint West'});
        const kimWest = await createUser({username:'Chicago West', password:'what happened to us'});
        // console.log(elonsSpring);
        // console.log(kimKanye);
        // console.log(kanyeKim);
        // console.log(kimWest);
        console.log("success creating users!")
    } catch(error){
        console.error("error creating kaynes offspring")
        throw error;
    }
}

async function createInitialActivities(){
    try{
        console.log("creating inital activites");
        const shakeWeight = await createActivity({name:'shakeweighting',description:'shake the weight around and bust out the kcals'})
        const deadlift = await createActivity({name: 'deadlift', description:'Lift with your legs!!!'})
        const sprint = await createActivity({name:'sprint',description:'put one foot in front of the other quickly'})
        const legLift = await createActivity({name:'legLift',description:'Put your leg up in the air and then the other one.'})
        const sitUp = await createActivity({name:'sitUp', description:'Sit up using your abs primarily, no using a jolt of movement'})
        const planks = await createActivity({name:'Planks', description:'hold your body above the ground by your arms and feet, keeping your back straight.'})
        // console.log(shakeweight, sitUp, sprint)
        console.log("success creating activities")
    }catch(error){
        console.log("this is an error for initial activities")
    }

}

async function createInitialRoutines(){
    try{
        console.log("create initial routines")
        const legDay = await createRoutine({creatorId: '1', isPublic: true,name:'leg day'
            ,goal:'feel the burn in those legs!'});
        const abs = await createRoutine({creatorId:'3', isPublic:true,name:'abs'
            ,goal:'in modern exercise one should workout their abs daily.'})
        const armsDay = await createRoutine({creatorId:'2', isPublic:false,name:'armsday'
            ,goal:'do high intensity lifting, benching mostly'})
        console.log(legDay, abs, armsDay);
        console.log("success creating initial routines")
    }catch(error){
        console.log(error);
    }
}

async function createInitialRoutineActivities(){
    try{
        console.log("creating initial routine activities....")
        const routLegs = await addActivityToRoutine({routineId:1,activityId:3,duration:10,count:1})
        const routAbs = await addActivityToRoutine({routineId:2,activityId:6,duration:1,count:3})
        const routArms = await addActivityToRoutine({routineId:3,activityId:1,duration:15,count:2})
        console.log(routAbs,routArms,routLegs)
    } catch(error){
        console.log(error);
    }
}
async function testDB(){
    await getUserById(1);
    await getUserByUsername('Psalm West');
    await getUser('Psalm West','Saint West');
    await getAllRoutines();
    await updateRoutine({id:1, isPublic: true, name: 'ankle day', goal: 'make sure to do lots of calf stretching'})
    await getRoutineActivityById(1);
    await updateRoutineActivity(1,{duration:10,count:30}) //haha I got THIS to work, WOW.
    await destroyRoutineActivity(1);
    await getRoutineActivitiesByRoutine('leg day');

    // functions to test in the testDB case
    // getRoutineActivitiesByRoutine
    // getActivityById,
    // getAllPublicRoutines,getPublicRoutinesByUser,
    // destroyRoutine,getRoutineByName,getRoutineByUser,
    // getRoutineById
}

async function rebuildDB(){
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialActivities();
    await createInitialRoutines();
    await createInitialRoutineActivities();
    await testDB()
    client.end()
}

rebuildDB()

//final notes on the seed and the rest of the database to finish
//every function inside the testDB needs to be created or tested (some already exist and haven't been tested)
// I need to finish building out the index.js file, exporting the functions through index.js to emir
// 
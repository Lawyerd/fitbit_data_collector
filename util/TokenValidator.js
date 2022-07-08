const mongoose = require('mongoose');
const axios = require('axios')
const FITBIT_URL = 'https://api.fitbit.com'
const MONGODB_URI = process.env.MONGODB_URI
const FILE = './schema/user.json'
const COLLECTION_NAME = 'users'
var fs = require('fs');

const dataSchema = readFile(FILE)
const Model = mongoose.model(COLLECTION_NAME, dataSchema);

function readFile(filename){
    var data = fs.readFileSync(filename, {encoding: 'utf8'});
    var json = JSON.parse(data);
    return json
}

let connection = null; 
const connect = () => { 
    if (connection && mongoose.connection.readyState === 1) 
        return Promise.resolve(connection); 
        return mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
        .then( conn => { connection = conn; return connection; } ); 
};

async function getAccessTokens(){
    // get User Data from MONGODB
    let accessTokenList = []
    const getUsersURI = 'https://e4v219k1w9.execute-api.ap-northeast-2.amazonaws.com/default/getUser'
    let response = await axios.get(getUsersURI);
    
    for (let user of response.data){
        const filterdUser = {
            _id: user._id,
            userId: user.userId,
            accessToken: user.accessToken,
            isTokenValid: user.isTokenValid
        }
        accessTokenList.push(filterdUser)
    }
    return accessTokenList;
}

async function testValidate(users){
    const DETAIL_URI = '/1/user/-/profile.json'
    const URI = FITBIT_URL + DETAIL_URI
    
    for (let user of users){
        if(user.isTokenValid){
            try{
                const config = {
                    headers:{
                        Authorization: 'Bearer '+user.accessToken
                    }
                }
                let response = await axios.get(URI, config)
                console.log(user.userId + ` have a valid token`)
            }catch(e){
                await updateTokenValid(user)
            }
        }else{
            console.log(user.userId + ` have an invalid token`)
        }
    }
    return ""
}

async function updateTokenValid(user){
    console.log(user.userId + ` have an invalid token, but is marked valid!`)
    let userId = user.userId
    const reg_userId = new RegExp(userId)
    await connect()
    
    try{
        // const user = await Model.findOne({userId:reg_userId})
        await Model.findOneAndUpdate({userId:userId}, { isTokenValid:false })
        console.log(user.userId + ` token's state is changed from valid to invalid`)

    }catch(err){
        console.log(err)
    }
}

exports.handler = async (event) => {
    const accessTokens = await getAccessTokens();
    await testValidate(accessTokens)
};

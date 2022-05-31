const mongoose = require('mongoose');
const axios = require('axios')
const FITBIT_URL = 'https://api.fitbit.com'
const COLLECTION_NAME = 'sleep'
const FILE = 'schema/sleep.json'
const MONGODB_URI = process.env.MONGODB_URI
const { DateGenerator } = require("./util/DateGenerator")
var fs = require('fs');

const dataSchema = readFile(FILE)
const Model = mongoose.model(COLLECTION_NAME, dataSchema);

let connection = null;
const connect = () => {
    if (connection && mongoose.connection.readyState === 1)
        return Promise.resolve(connection);
    return mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
        .then(conn => { connection = conn; return connection; });
};

function readFile(filename) {
    var data = fs.readFileSync(filename, { encoding: 'utf8' });
    var json = JSON.parse(data);
    return json
}

async function getAccessTokens() {
    // get User Data from MONGODB
    let accessTokenList = []
    const getUsersURI = 'https://e4v219k1w9.execute-api.ap-northeast-2.amazonaws.com/default/getUser'
    let response = await axios.get(getUsersURI);

    for (let user of response.data) {
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

async function getData(beforeDate, users) {
    // Get user's bio data from fitbit web API
    const URI = FITBIT_URL+'/1.2/user/-/sleep/list.json'
    

    let usersData = []

    for (let user of users) {
        if (user.isTokenValid) {
            try {
                const config = {
                    headers:{
                        Authorization: 'Bearer '+user.accessToken
                    },
                    params:{
                        beforeDate: beforeDate,
                        sort:'desc',
                        limit:1,
                        offset:0
                    }
                }
                
                let response = await axios.get(URI, config)
                response.data.userId = user.userId
                usersData.push(response.data)
                console.log("Get "+user.userId+"'s data")
            } catch (e) {
                console.log(user.userId+" has an invalid token, but is marked valid!")
            }
        } else {
            console.log(user.userId+" has an invalid token")
        }
    }

    return usersData
}

function cleanData(rawData) {
    // Filter and delete some data from raw data

    let usersSleepData = []
    
    
    for (let i in rawData) {
        const data = rawData[i]
        let sleepData = data['sleep'][0]
        delete sleepData.infoCode
        delete sleepData.type
        
        sleepData._id = sleepData.logId
        delete sleepData.logId
        
        sleepData.date = sleepData.dateOfSleep
        delete sleepData.dateOfSleep
        
        sleepData.logs = sleepData['levels']['data']
        sleepData.summary = sleepData['levels']['summary']
        delete sleepData['levels']
        
        sleepData.userId = rawData[i].userId
        usersSleepData.push(sleepData)
    }

    return usersSleepData
}

async function storeData(newData) {
    // Store users' bio data to MONGODB
    await connect()
    for (let data of newData) {
        let regex = {}
        const _id = data["_id"]
        regex["_id"] =  data["_id"]
    
        // 데이터 가져오기
        const user = await Model.findOne(regex)

        if(user!=null){
            console.log("Data is already exist in "+_id)
            await Model.findOneAndUpdate(regex, data)
            console.log("Update document!")
        }else{
            console.log("Data is not exist in "+_id+", Create new document!")
            const newModel = new Model(data);
            await newModel.save()
        }

    }
    console.log("SAVED!")
}

exports.handler = async (event) => {
    const accessTokens = await getAccessTokens();
    const rawData = await getData(DateGenerator(0), accessTokens)
    const cleanedData = cleanData(rawData)
    await storeData(cleanedData)
    return
};

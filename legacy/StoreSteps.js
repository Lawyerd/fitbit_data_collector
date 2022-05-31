const mongoose = require('mongoose');
const axios = require('axios')
const FITBIT_URL = 'https://api.fitbit.com'
const COLLECTION_NAME = 'steps'
const FILE = 'schema/steps.json'
const MONGODB_URI = process.env.MONGODB_URI
var fs = require('fs');
const { DateGenerator } = require("./util/DateGenerator")


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
    const DETAIL_URI = `/1/user/-/activities/${COLLECTION_NAME}/date/${beforeDate}/1d/1min.json`
    const URI = FITBIT_URL + DETAIL_URI

    let usersData = []

    for (let user of users) {
        if (user.isTokenValid) {
            try {
                const config = {
                    headers: {
                        Authorization: 'Bearer ' + user.accessToken
                    }
                }
                let response = await axios.get(URI, config)
                response.data.userId = user.userId
                usersData.push(response.data)
                console.log("Get " + user.userId + "'s data")
            } catch (e) {
                console.log(user.userId + " has an invalid token, but is marked valid!")
            }
        } else {
            console.log(user.userId + " has an invalid token")
        }
    }

    return usersData
}

function cleanData(rawData, accessTokens) {
    // Filter and delete some data from raw data
    let cleanedData = []

    for (let i in rawData) {
        const data = rawData[i]
        let new_data = {}
        new_data.dateTime = data[`activities-${COLLECTION_NAME}`][0]["dateTime"]
        new_data.value = data[`activities-${COLLECTION_NAME}`][0]["value"]
        new_data.dataset = data[`activities-${COLLECTION_NAME}-intraday`]["dataset"]
        new_data.userId = accessTokens[i].userId

        cleanedData.push(new_data)
    }
    return cleanedData
}

async function storeData(newData) {
    // Store users' bio data to MONGODB
    await connect()

    for (let data of newData) {
        let regex = {}
        const dateTime = data["dateTime"]
        regex["userId"] = data["userId"]
        regex["dateTime"] = dateTime

        // 데이터 가져오기
        const user = await Model.findOne(regex)

        if (user != null) {
            console.log("Data is already exist in " + dateTime)
            await Model.findOneAndUpdate(regex, data)
            console.log("Update document!")
        } else {
            console.log("Data is not exist in " + dateTime + ", Create new document!")
            const newModel = new Model(data);
            await newModel.save()
        }

    }
    console.log("SAVED!")
}

exports.handler = async (event) => {
    const accessTokens = await getAccessTokens();
    const targetDate = DateGenerator(0)
    const rawData = await getData(targetDate, accessTokens)
    const cleanedData = cleanData(rawData, accessTokens)
    await storeData(cleanedData)
};

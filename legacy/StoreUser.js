const mongoose = require('mongoose');
const axios = require('axios')
// const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = process.env.MONGODB_URI
const accessToken = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzhCS0siLCJzdWIiOiI5WjdWOVIiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNjg0MDUyOTc4LCJpYXQiOjE2NTI1MTY5Nzh9.RVbYacEbmvDy9oCWMNV4wJtGB4zhTjCKDvrvUmUU3Yo`
const FITBIT_URL = 'https://api.fitbit.com'
const COLLECTION_NAME = 'users'
const FILE = './schema/user.json'
var fs = require('fs');

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

async function getData(){
    const url = FITBIT_URL+'/1/user/-/profile.json'
    const config = {
        headers:{
            Authorization: 'Bearer '+accessToken
        }
    }
    let response = await axios.get(url, config);
    return response.data;
}

async function getDevice(accessToken){
    const url = FITBIT_URL+'/1/user/-/devices.json'
    const config = {
        headers:{
            Authorization: 'Bearer '+accessToken
        }
    }
    let response = await axios.get(url, config);
    return response.data[0].id;
}

function cleanData(rawData){
    rawData = rawData.user
    delete rawData.ambassador
    delete rawData.autoStrideEnabled
    delete rawData.challengesBeta
    delete rawData.clockTimeDisplayFormat
    delete rawData.corporate
    delete rawData.corporateAdmin
    delete rawData.displayName
    delete rawData.displayNameSetting
    delete rawData.distanceUnit
    delete rawData.encodedId
    delete rawData.features
    delete rawData.foodsLocale
    delete rawData.glucoseUnit
    delete rawData.heightUnit
    delete rawData.isBugReportEnabled
    delete rawData.isChild
    delete rawData.isCoach
    delete rawData.languageLocale
    delete rawData.legalTermsAcceptRequired
    delete rawData.locale
    delete rawData.memberSince
    delete rawData.mfaEnabled
    delete rawData.offsetFromUTCMillis
    delete rawData.sdkDeveloper
    delete rawData.sleepTracking
    delete rawData.startDayOfWeek
    delete rawData.strideLengthRunning
    delete rawData.strideLengthRunningType
    delete rawData.strideLengthWalking
    delete rawData.strideLengthWalkingType
    delete rawData.swimUnit
    delete rawData.temperatureUnit
    delete rawData.timezone
    delete rawData.topBadges
    delete rawData.waterUnit
    delete rawData.waterUnitName
    delete rawData.weightUnit
    
    delete rawData.avatar150
    delete rawData.avatar640
    
    
    rawData.avatar = rawData.avatar640
 
    return rawData
}

async function addData(parsedData){
    const deviceId = await getDevice(accessToken)

    parsedData.accessToken = accessToken
    parsedData.device = {
        fitbit:[deviceId]
    }
    parsedData.isToeknValid = true
    parsedData.family = []
    parsedData._id = "1245"
    parsedData.userId = "tester_test"

    return parsedData
}

async function storeData(newData){
    const dataSchema = readFile(FILE)
    const mongooseSchema = mongoose.Schema(dataSchema)
    const Model = mongoose.model(COLLECTION_NAME, dataSchema);

    await connect()
    const newUser = new Model(newData);
    await newUser.save()
}

exports.handler = async (event) => {
    const rawData = await getData()
    let parsedData = cleanData(rawData)
    let finalData = await addData(parsedData)
    await storeData(finalData)

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!')
    };

    return response;
};

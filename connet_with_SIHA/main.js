const { storeData } = require('./storeData')
const { getToken } = require('./getToken')
const { getData } = require('./getData')
const { getUsers } = require('../db/users.js')
const { DataTypeMarket } = require("../util/DataTypeMarket")
const { DateGenerator } = require('../util/DateGenerator')
const { TimeGenerator } = require('../util/TimeGenerator')

async function getDataSource(){
    let targetDate = DateGenerator(100)
    let currentTime = TimeGenerator(11)
    let startTime = currentTime[0]
    let endTime = currentTime[1]
    const dataSource = DataTypeMarket(targetDate, startTime, endTime)
    return dataSource
}

async function getUserList(){
    const users = getUsers()
    let userList = []
    for(let user of users){
        let userInfo = await getToken(user.email, user.email)
        userList.push(userInfo)
    }
    return userList
}

exports.handler = async (event) => {
    const userList = await getUserList()
    const dataSource = await getDataSource()

    for(alias of dataSource){
        for(user of userList){
            const data = await getData(alias, user)
            await storeData(user._id, user._id, alias.name, 200)
        }
    }
};

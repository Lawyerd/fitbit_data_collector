const { storeData } = require('./storeData')
const { getToken } = require('./getToken')
const { getData } = require('./getData')
const { getUsers } = require('../db/users.js')
const { DataTypeMarket } = require("../util/DataTypeMarket")
const { DateGenerator } = require('../util/DateGenerator')
const { TimeGenerator } = require('../util/TimeGenerator')
const { invalidateToken } = require('./invalidateToken')
const { cleanData } = require('./cleanData')
const {updateToken}=require('./updateToken')

async function getDataSource() {
    let targetDate = DateGenerator(100) // 오늘로부터 100일 전의 날짜를 '20xx-xx-xx' 형태의 String으로 불러옴
    let currentTime = TimeGenerator(11) // 현재 시각으로부터 11분 전의 시간 기준으로 [xx:00, xx:59]형태의 배열로 반환
    let startTime = currentTime[0]
    let endTime = currentTime[1]
    const dataSource = DataTypeMarket(targetDate, startTime, endTime) // 특정한 시간대의 데이터를 가져올 수 있는 Fitbit Web API URL를 alias 별로 반환
    return dataSource
}

async function getUserList() {
    const users = getUsers() // 유저의 이름과 email을 가져옴
    let userList = [] // 유저의 토큰이 저장될 배열
    for (let user of users) {
        let userInfo = await getToken(user.email, user.email) // 유저의 email로 특정 유저의 token을 가져옴
        userList.push(userInfo)
    }
    return userList
}

exports.handler = async (event) => {
    const userList = await getUserList()
    const dataSource = await getDataSource()

    for (alias of dataSource) {
        for (user of userList) {
            try {
                const data = await getData(alias, user) // fitbit web API로부터 데이터를 가져오기 위해선 두 가지가 필요 (데이터가 저장된 URL, user의 토큰)
                const cleanedData = cleanData(data, alias) // fitbit API를 통해 가져온 데이터 중 사용할 integer 데이터만 저장

                console.log(cleanedData)
                // await storeData(user._id, user._id, alias.name, cleanedData) // SIHA서버에 해당 데이터 저장
            } catch (e) {
                if (e.response) {
                    if (e.response.status == 401) {
                        console.log(`ERROR: [${user.name}]의 토큰은 유효하다고 마크되어 있지만 유효하지 않은 토큰입니다.`) 
                        await invalidateToken(user._id, user._id)
                    } else if (e.response.status == 404) {
                        console.log(`ERROR: Fitbit Web API의 URI가 정확하지 않습니다.`)
                    }
                }
            }
        }
    }
};

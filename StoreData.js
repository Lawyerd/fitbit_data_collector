const axios = require('axios')
const { DataTypeMarket } = require("./util/DataTypeMarket")
const { DateGenerator } = require('./util/DateGenerator')
const {TimeGenerator} = require('./util/TimeGenerator')

async function getAllUsers() {
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

async function getData(sourceInfo, user) {
    if(!user.isTokenValid){
        console.log(`[${user.userId}] token is invalid`)
    }else{
        console.log(`[${user.userId}] token is valid`)
        try {
            const config = {
                headers: {
                    Authorization: 'Bearer ' + user.accessToken
                },
                params: sourceInfo.params
            }
            // console.log(sourceInfo.URI)
            let response = await axios.get(sourceInfo.URI, config)
            return response.data
        } catch (e) {
            if(e.response){
                if(e.response.status == 401){
                    console.log(`ERROR: [${user.userId}]의 토큰은 유효하다고 마크되어 있지만 유효하지 않은 토큰입니다.`)
                }else if(e.response.status == 404){
                    console.log(`ERROR: Fitbit Web API의 URI가 정확하지 않습니다.`)
                }
            }
        }
    }
    
}

async function main(dataSource, users){
    for(let dataType of dataSource){
        console.log(`[${dataType.name}] data collecting... `)
        for(let user of users){
            const userData = await getData(dataType, user)
            console.log(userData)

            // const url = "eqwe"
            // try {
            //     await axios.port(url, userData)
            // }catch(e){
            //     console.log(e)
            // }


        }
        console.log()
        console.log()
    }
}

exports.handler = async (event) => {
    const users = await getAllUsers()

    let targetDate = DateGenerator(1)

    let currentTime = TimeGenerator(11)
    let startTime = currentTime[0]
    let endTime = currentTime[1]


    const dataSource = DataTypeMarket(targetDate, startTime , endTime)

    main(dataSource, users)
};

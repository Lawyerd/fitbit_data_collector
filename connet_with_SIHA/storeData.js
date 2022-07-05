const axios = require('axios')

function headerGenerator(careUser, dataType){
    const current = new Date()
    const header = {
        "time":{"year":current.getFullYear(), "month":current.getMonth()+1, "date":current.getDate(), "hour":current.getHours()},
        "careUser":careUser,
        "dataType":dataType
    }
    return header
}

exports.storeData = async function storeData(client, id, alias, log) { 
    const ROOTURL = "https://32sfdx6w3c.execute-api.ap-northeast-2.amazonaws.com/test1"
    const URL = ROOTURL + "/health/fitbit-api/entity/fitbit-gateway"

    const data = {
        header: headerGenerator(client, alias),
        data: log
    }
    
    try{
        const response = await axios.put(URL, data, {params:{
            client: client+":gateway",
            id: id+":gateway",
            service: 'device-message'
        }})
        console.log(response.data)
    }catch(e){
        console.log("error")
    }
}


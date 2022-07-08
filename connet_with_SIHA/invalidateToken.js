const axios = require('axios')

exports.invalidateToken = async function (client, id){
    const ROOTURL = "https://32sfdx6w3c.execute-api.ap-northeast-2.amazonaws.com/test1"
    const URL = ROOTURL + "/health/fitbit-api/entity/fitbit-gateway"
    const response = await axios.put(URL, {
        "userId": client
        }, {params:{
        client: client+":gateway",
        id: id+":gateway",
        service: 'token-invalidation'
    }})
    return null
}

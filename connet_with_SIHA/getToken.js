const axios = require('axios')

exports.getToken = async function getToken(client, id) {
    const ROOTURL = "https://32sfdx6w3c.execute-api.ap-northeast-2.amazonaws.com/test1"
    const URL = ROOTURL + "/health/fitbit-api/entity/fitbit-gateway"
    const response = await axios.put(URL, null, {params:{
        client: client+":gateway",
        id: id+":gateway",
        service: 'user-list'
    }})
    return response.data[0]
}
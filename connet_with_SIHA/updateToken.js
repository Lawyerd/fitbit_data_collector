const axios = require('axios')
const URL = `https://32sfdx6w3c.execute-api.ap-northeast-2.amazonaws.com/test1/health/user-app/entity/user`

exports.updateToken = async function (id, client, newToken){
    const response = await axios.put(URL, null, {params:{
        client: client,
        id: id,
        update: {'fitbitToken': newToken}
    }})
    console.log(response.data)
}

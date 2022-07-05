const axios = require('axios')

async function invalidateToken(client, id){
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

exports.getData = async function getData(alias, user) {
    if (user.fitbitToken == "$expired") {
        console.log(`[${user.name}] token is expired`)
    } 
    else {
        console.log(`[${user.name}] token is valid`)
        try {
            const config = {
                headers: {
                    // Authorization: 'Bearer ' + user.fitbitToken
                    Authorization: 'Bearer ' + "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzg4SkwiLCJzdWIiOiI5VzJCNEoiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcmFjdCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNjc5MzAzMDI1LCJpYXQiOjE2NDc3NjcwMjV9.JxxpjsrRclALPpDxIWQpEs7jxR7URE-nmhu81zEzbqc"
                },
                params: alias.params
            }
            // console.log(alias.)
            let response = await axios.get(alias.URI, config)
            return response.data
        } catch (e) {
            if (e.response) {
                if (e.response.status == 401) {
                    console.log(`ERROR: [${user.name}]의 토큰은 유효하다고 마크되어 있지만 유효하지 않은 토큰입니다.`)
                    await invalidateToken(user._id,user._id)
                } else if (e.response.status == 404) {
                    console.log(`ERROR: Fitbit Web API의 URI가 정확하지 않습니다.`)
                }
            }
        }
    }

}


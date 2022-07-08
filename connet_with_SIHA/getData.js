const axios = require('axios')

exports.getData = async function getData(alias, user) {
    // if (user.fitbitToken == "$expired") {
    //     console.log(`[${user.name}] token is expired`)
    // } 
    // else {
        console.log(`[${user.name}] token is valid`)
        try {
            const config = {
                headers: {
                    // Authorization: 'Bearer ' + user.fitbitToken
                    Authorization: 'Bearer ' + "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzg4SkwiLCJzdWIiOiI5VzJCNEoiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcmFjdCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNjc5MzAzMDI1LCJpYXQiOjE2NDc3NjcwMjV9.JxxpjsrRclALPpDxIWQpEs7jxR7URE-nmhu81zEzbqc"
                },
                params: alias.params
            }
            let response = await axios.get(alias.URI, config)
            return response.data
        } catch (e) {
            throw e
        }
    // }

}


const FITBIT_URL = 'https://api.fitbit.com'

exports.DataTypeMarket = function(targetDate, startTime, endTime) {
    return DATA_TYPE = [
        {
            name: 'heart',
            URI: FITBIT_URL + `/1/user/-/activities/heart/date/${targetDate}/1d/1min/time/${startTime}/${endTime}.json`,
            params: null
        },
        {
            name: 'calories',
            URI: FITBIT_URL + `/1/user/-/activities/calories/date/${targetDate}/1d/1min/time/${startTime}/${endTime}.json`,
            params: null
        },
        {
            name: 'distance',
            URI: FITBIT_URL + `/1/user/-/activities/distance/date/${targetDate}/1d/1min/time/${startTime}/${endTime}.json`,
            params: null
        },
        {
            name: 'steps',
            URI: FITBIT_URL + `/1/user/-/activities/steps/date/${targetDate}/1d/1min/time/${startTime}/${endTime}.json`,
            params: null
        },
        {
            name: 'sleep',
            URI: FITBIT_URL + '/1.2/user/-/sleep/list.json',
            params: {
                        beforeDate: targetDate,
                        sort:'desc',
                        limit:1,
                        offset:0
                    }
        },
        // {
        //     name: 'device',
        //     URI: FITBIT_URL + `/1/user/-/devices.json`,
        //     params: null
        // },
    ]
}


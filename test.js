const fs = require('fs')




const sampleJSON = {
    name: 'sleep',
    URI: '/1.2/user/-/sleep/list.json',
    params: {
                beforeDate: '12',
                sort:'desc',
                limit:1,
                offset:0
            }
}

let today = new Date(); 
const currentTime = today.toLocaleString()
fs.writeFile(`log/${currentTime}.json`,JSON.stringify(sampleJSON),function(err){
    if (err === null) {
        console.log('success');
    } else {
        console.log(err);
    }
});
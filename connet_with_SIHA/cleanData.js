exports.cleanData = function (data, alias) {
    const dataName = alias.name
    let cleanedData = 0
    switch(dataName){
        case 'heart':
            cleanedData = data['activities-heart'][0]['value']
            break;
        case 'calories':
            cleanedData = data['activities-calories'][0]['value']
            break;
        case 'distance':
            cleanedData = data['activities-distance'][0]['value']
            break;
        case 'steps':
            cleanedData = data['activities-steps'][0]['value']
            break;
        case 'sleep':
            if(data['sleep'].length==0){
                cleanedData = 0
            }else{
                cleanedData = data['sleep'][0]['duration']
            }
            
            break;
    }
    return cleanedData
}
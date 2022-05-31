exports.TimeGenerator = function(minusMinutes) {
    const today = new Date()
    const targetDate = new Date(today)

    targetDate.setMinutes(targetDate.getMinutes() - minusMinutes)
    const hours = targetDate.getHours();
    const startTime = hours + ":00"
    const endTime = hours + ":59"
    
    return [startTime, endTime]
}

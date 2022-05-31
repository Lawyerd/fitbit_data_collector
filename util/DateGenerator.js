exports.DateGenerator = function(minusDate) {
    const today = new Date()
    const targetDate = new Date(today)

    targetDate.setDate(targetDate.getDate() - minusDate)
    const year = targetDate.getFullYear();
    let month = targetDate.getMonth() + 1;
    if (month < 10) {
        month = '0' + month
    }
    let date = targetDate.getDate();
    if (date < 10) {
        date = '0' + date
    }
    return year + '-' + month + '-' + date
}

// const StoreUser = require("./StoreUser")
// const StoreHeart = require("./StoreHeart")
// const StoreSleep = require("./StoreSleep")
// const TokenValidator = require("./TokenValidator")
// const StoreCalories = require("./StoreCalories")
// const StoreDistance = require("./StoreDistance")
const StoreData = require("./StoreData")

// StoreUser.handler()
// StoreDistance.handler()
// StoreCalories.handler()
// StoreHeart.handler()
// StoreSleep.handler()
// TokenValidator.handler()

exports.handler = async (event) => {
    StoreData.handler()
};
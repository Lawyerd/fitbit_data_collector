// const StoreUser = require("./StoreUser")
// const StoreHeart = require("./StoreHeart")
// const StoreSleep = require("./StoreSleep")
// const TokenValidator = require("./TokenValidator")
// const StoreCalories = require("./StoreCalories")
// const StoreDistance = require("./StoreDistance")
// const StoreData = require("./StoreData")
const main = require("./connet_with_SIHA/main")

// StoreUser.handler()
// StoreDistance.handler()
// StoreCalories.handler()
// StoreHeart.handler()
// StoreSleep.handler()
// TokenValidator.handler()

exports.handler = async (event) => {
    // StoreData.handler()
    main.handler()
};
const mongoose = require('mongoose')
async function getconnectmongodb(url) {
    await mongoose.connect(url);
}
module.exports = {getconnectmongodb};
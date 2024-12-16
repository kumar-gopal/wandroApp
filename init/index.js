const Listing = require("../models/models.listing");
const initData = require("./alldata.js");
const dbConnect = require("../config/dbconnection")


const initDB = async()=>{
    await Listing.deleteMany({});    
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:"675c2d9a9e937537aa0a3c5a"
    }));
    await Listing.insertMany(initData.data);    
}

module.exports = initDB;
// initDB().then(()=>{
//     console.log("sampleListing is successfully saved in database !!!");
// })
// .catch((err)=>{
//     console.log("problem while sampleListing is saving to database ",err);
    
// })
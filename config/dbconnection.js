require('dotenv').config();
const mongoose = require("mongoose");

const dbConnect = async()=>{
        try {
            const connectionMethod = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL} / ${process.env.DB_NAME}`);
            console.log(`Database is connected successfully !!! DB HOST : ${connectionMethod.connection.host} and DB NAME : ${connectionMethod.connection.name}`);
            
        } catch (error) {
            console.log("problem while connecting database",error);
        }
}

module.exports = dbConnect;


const { string, types } = require("joi");
const mongoose = require("mongoose");
const {Schema} = mongoose;


const reviewSchema = new Schema({
    comment:{ 
        type : String
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt : {
        type:Date,
        default : Date.now,
    },
    userId:{
        type: String,
    },
    reviewedBy:{
        type:String
    }
});

module.exports = mongoose.model("Review",reviewSchema);
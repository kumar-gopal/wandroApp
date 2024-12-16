const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./models.review");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "https://unsplash.com/photos/person-walking-towards-house-z9hvkSDWMIM",
      set: (v)=> 
        v === "" 
      ? "https://unsplash.com/photos/person-walking-towards-house-z9hvkSDWMIM" 
      : v,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    reviews:[
      {
        type : Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner :{
      type : Schema.Types.ObjectId,
      ref : "User",
    },
  },
  
  {
    timestamps: true,
  }
);

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

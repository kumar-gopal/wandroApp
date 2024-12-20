const express = require("express");
const router = express.Router({mergeParams:true}); 
const Review = require("../models/models.review");
const Listing = require("../models/models.listing")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");


// validate middleware for reviews
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
}


// post  review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id);
    
    if(!listing){
        throw new ExpressError(400,"Listing is required");
    }
    const review = new Review(req.body.review);
    listing.reviews.push(review);

   await listing.save();
   await review.save();
   
   
   console.log("review is created");
   req.flash("success", "Review is created successfully!");
   res.redirect(`/listings/${listing._id}`);
}));


// delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted successfully!");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;
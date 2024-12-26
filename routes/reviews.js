const express = require("express");
const router = express.Router({mergeParams:true}); 
const Review = require("../models/models.review");
const Listing = require("../models/models.listing")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");



validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
}


router.post("/", 
    validateReview, 
    wrapAsync(async (req, res) => {
    const { id } = req.params;

    // Fetch the listing by ID
    const listing = await Listing.findById(id);
    
    

    // Ensure user is authenticated
    if (!req.user || !req.user.username) {
        throw new ExpressError(401, "User not authenticated");
    }

    // Validate review data
    if (!req.body.review) {
        throw new ExpressError(400, "Review data is required",req.body);
    }

    // Create and associate review
    const review = new Review(req.body.review);
    review.reviewedBy = req.user.username;
    review.userId = req.user._id;
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    
    req.flash("success", "Review is created successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

router.post("/",(req,res)=>{
    let {id} = req.params;
    res.redirect(`/listings/${id}`);
});

// delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted successfully!");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;
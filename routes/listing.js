const express = require("express");
const router = express.Router(); 
const Listing = require("../models/models.listing");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");



// validate middle for listing
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
}


// show all Listings

router.get("/", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("./listing/index.ejs",{allListings});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
});




// create Listing
router.get("/new",
    isLoggedIn,
    (req,res)=>{
    res.render("./listing/new.ejs");
});



// 
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing); // Create a new listing instance
        newListing.owner = req.user._id;
        await newListing.save(); // Save the new listing to the database
        req.flash("success", "New Listing is created successfully!"); // Flash success message
        res.redirect("/listings"); // Redirect to the listings page
    })
);




// edit
router.get("/:id/edit",
    isLoggedIn,
    async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
  
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    
    res.render("./listing/edit.ejs",{listing});
});

// update

router.put("/:id",validateListing, async (req, res) => {
    try {
        const { id } = req.params; 
        // Update the listing
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            req.body.listing, // Directly use req.body.listing
            { new: true } // Returns the updated document
        );
         
        if (!updatedListing) {
            return res.status(404).send("Listing not found");
        }
        req.flash("success", "Listing is Updated successfully!");
        console.log("Updated successfully:-\n",updatedListing);
        
        res.redirect(`/listings/${updatedListing._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the listing");
    }
});



// delete listing
router.delete("/:id", 
    isLoggedIn,
    async (req, res) => {
    let { id } = req.params; // Use let instead of const if you want to reassign
    try {
        const deletedListing = await Listing.findByIdAndDelete(id);
        // console.log(deletedListing);
        req.flash("success", "Listing is Deleted successfully!");
        res.redirect("/listings"); // Absolute path for redirection
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/:id",async(req,res,next)=>{
    try {
        let {id} = req.params;
        const listing = await Listing.findById(id).populate("reviews").populate("owner");
        console.log(listing);
        
        
        if(!listing){
            req.flash("error", "Listing you requested for does not exists!");
            res.redirect("/listings");
        }
        res.render("./listing/show.ejs",{listing});
    } catch (error) {
        next(new ExpressError(404,"Page Not Found"));
    }
});


module.exports = router;
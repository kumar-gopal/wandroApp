const Listing = require("../models/models.listing");

const { uploadImageOnCloudinary } = require("../config/cloudnary.js")

const newformrendering = (req,res)=>{
    res.render("./listing/new.ejs");
}
const creatNewListing = async(req, res, next) => {
    try {
      // If no file is uploaded
      if (!req.file) {
        req.flash("error", "Image is required!");
        return res.redirect("/listings/new");
      }

      // Upload the file to Cloudinary
      const cloudinaryResponse = await uploadImageOnCloudinary(req.file.path);
    //   console.log(cloudinaryResponse);
      

      if (!cloudinaryResponse) {
        req.flash("error", "Failed to upload image to Cloudinary!");
        return res.redirect("/listings/new");
      }

      // Create a new listing instance
      const newListing = new Listing(req.body.listing);
      newListing.image = {
        url: cloudinaryResponse.secure_url, // Save the Cloudinary URL
        fileName : cloudinaryResponse.originalname, // Save the public ID for potential deletions
      };
      newListing.owner = req.user._id;

      // Save the listing to the database
      await newListing.save();

      // Remove the locally saved image file after Cloudinary upload
      const fs = require("fs");
      fs.unlinkSync(req.file.path);

      req.flash("success", "New Listing is created successfully!");
      res.redirect("/listings");
    } catch (error) {
      console.error("Error creating listing:", error);
      req.flash("error", "Something went wrong!");
      res.redirect("/listings/new");
    }
}

const getAllUser = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("./listing/index.ejs",{allListings});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}
const editListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
  
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    
    res.render("./listing/edit.ejs",{listing});
}
const updateListing = async (req, res) => {
    try {
        const { id } = req.params; 
        // Update the listing
        if (!req.file) {
            req.flash("error", "Image is required!");
            return res.redirect("/listings/new");
          }
    
          // Upload the file to Cloudinary
          const cloudinaryResponse = await uploadImageOnCloudinary(req.file.path);
    
          if (!cloudinaryResponse) {
            req.flash("error", "Failed to upload image to Cloudinary!");
            return res.redirect(`/listings/${updatedListing._id}`);
        }
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            {
                ...req.body.listing,
                image : {
                    url: cloudinaryResponse.secure_url, // Save the Cloudinary URL
                    fileName : cloudinaryResponse.originalname, // Save the public ID for potential deletions
                }
                
            },
             // Directly use req.body.listing
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
}
const deleteListing = async (req, res) => {
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
}
const getListingwithId = async(req,res,next)=>{
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
}
module.exports = {
    creatNewListing,
    getAllUser,
    editListing,
    updateListing,
    deleteListing,
    getListingwithId,
    newformrendering
}
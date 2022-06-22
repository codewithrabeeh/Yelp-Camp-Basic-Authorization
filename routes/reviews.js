const express = require('express')
const router = express.Router({mergeParams: true})
const {validateReview} = require('../middleware')
const Review = require('../models/review')
const Campground = require('../models/campground')

const catchAsync = require('../utils/CatchAsync')
const ExpressError = require('../utils/ExpressError')



router.post('/', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created New Review')
    res.redirect(`/Campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {  /* here */
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully Deleted The Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router
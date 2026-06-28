const { Review } = require('../models')


exports.createReview = async (req, res, next) => {
    try {
        const clientId = req.user.id
        const touristId = req.params.id
        
        const { ratings, fullName, email, addYourReview } = req.body
        
        const review = await Review.create({
            ratings,
            fullName,
            email,
            addYourReview
        })

        res.status(201).json({
            message: "Review created successfully",
            data: review
        })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


exports.getAllReview = async (req, res, next) => {
    try {
        const allReviews = await Review.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            message: "Reviews retrieved successfully",
            data: allReviews,
            count: allReviews.length
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

exports.getAllByRatings = async (req, res, next) => {
    try {
        const { ratings } = req.params;
        const rating = await Review.findAll({ where: { ratings } });

        if (!rating.length) {
            return res.status(400).json({
                message: `No review found with ${ratings} star(s)`
            });
        }
        res.status(200).json({
            message: "Reviews successfully retrieved by ratings",
            data: rating
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

exports.getOneReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        res.status(200).json({
            message: "Review retrieved successfully",
            data: review
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

exports.getRatingStatistics = async (req, res) => {
    try {
        const ratings = await Review.findAll();
        const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalReviews = 0;

        ratings.forEach(item => {
            const rating = item.ratings;
            if (stats.hasOwnProperty(rating)) {
                stats[rating]++;
                totalReviews++;
            }
        });

        const percentages = {};
        Object.keys(stats).forEach(star => {
            percentages[star] = totalReviews
                ? ((stats[star] / totalReviews) * 100).toFixed(1)
                : 0;
        });

        res.status(200).json({
            success: true,
            totalReviews,
            ratings: stats,
            percentages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

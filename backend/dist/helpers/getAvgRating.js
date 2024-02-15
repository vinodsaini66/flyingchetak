"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvgRatingAndCount = void 0;
const _ = require("lodash");
function getAvgRatingAndCount(ratings) {
    if (!ratings || ratings.length <= 0) {
        return 0;
    }
    const ratingCount = ratings.length;
    const avgRating = _.reduce(ratings, (count, rating) => {
        if (!rating.rating) {
            return count;
        }
        return count + rating.rating;
    }, 0);
    return {
        rating: avgRating,
        total_reviews: ratingCount,
    };
}
exports.getAvgRatingAndCount = getAvgRatingAndCount;

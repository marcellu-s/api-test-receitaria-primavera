import mongoose from "mongoose";

export const Recipe = mongoose.model('Recipe', {
    title: String,
    about: String,
    author: String,
    image: String,
    duration: String,
    difficult: String,
    portion: String,
    additionalInformation: String,
    ingredients: Array,
    methodPreparation: Array,
    categories: Array,
    creatorID: String,
    myFavorite: Boolean
});
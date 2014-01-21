var mongoose = require('mongoose');

var Plat = mongoose.Schema({
    name: String,
    description: String,
    preparation: Number,
    cuisson: Number,
    ingredients: {
        panier: [String],
        acheter: [String]
    },
    ustensiles: [String],
    vin: String,
    recette: String
})

var OfferSchema = mongoose.Schema({
    name: String,
    description: String,
    date: {
        start: {type: Date, default: Date.now},
        end: Date
    },
    entree: Plat,
    plat: Plat,
    dessert: Plat
});

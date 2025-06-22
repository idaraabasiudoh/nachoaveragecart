const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'My Shopping List'
  },
  items: [{
    searchQuery: String,
    product: {
      title: String,
      price: Number,
      source: String,
      link: String,
      redirect_link: String,
      thumbnail: String,
      rating: Number,
      reviews: Number
    },
    quantity: {
      type: Number,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mealSuggestions: [{
    name: String,
    ingredients: [String],
    instructions: String,
    nutritionFacts: {
      calories: Number,
      protein: String,
      carbs: String,
      fat: String,
      fiber: String
    },
    prepTime: String,
    servings: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);

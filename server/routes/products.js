const express = require('express');
const { 
  searchProducts, 
  processImage, 
  uploadImage,
  getMealSuggestions 
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/search', auth, searchProducts);
router.post('/process-image', auth, uploadImage, processImage);
router.post('/meal-suggestions', auth, getMealSuggestions);

module.exports = router;

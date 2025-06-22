const express = require('express');
const {
  createList,
  getLists,
  getList,
  addItem,
  removeItem,
  updateMealSuggestions
} = require('../controllers/shoppingListController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createList);
router.get('/', auth, getLists);
router.get('/:id', auth, getList);
router.post('/:id/items', auth, addItem);
router.delete('/:id/items/:itemId', auth, removeItem);
router.put('/:id/meals', auth, updateMealSuggestions);

module.exports = router;

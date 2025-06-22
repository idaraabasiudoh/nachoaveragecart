const ShoppingList = require('../models/ShoppingList');
const User = require('../models/User');

exports.createList = async (req, res) => {
  try {
    const { name } = req.body;
    
    const list = new ShoppingList({
      user: req.userId,
      name: name || 'My Shopping List'
    });
    
    await list.save();
    
    // Add to user's shopping lists
    await User.findByIdAndUpdate(req.userId, {
      $push: { shoppingLists: list._id }
    });

    res.status(201).json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLists = async (req, res) => {
  try {
    const lists = await ShoppingList.find({ user: req.userId })
      .sort('-createdAt');
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getList = async (req, res) => {
  try {
    const list = await ShoppingList.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { searchQuery, product, quantity } = req.body;
    
    const list = await ShoppingList.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        $push: {
          items: {
            searchQuery,
            product,
            quantity: quantity || 1
          }
        }
      },
      { new: true }
    );
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const list = await ShoppingList.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        $pull: {
          items: { _id: req.params.itemId }
        }
      },
      { new: true }
    );
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMealSuggestions = async (req, res) => {
  try {
    const { meals } = req.body;
    
    const list = await ShoppingList.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { mealSuggestions: meals },
      { new: true }
    );
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

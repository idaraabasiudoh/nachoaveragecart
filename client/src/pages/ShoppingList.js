import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { shoppingLists, products } from '../services/api';
import toast from 'react-hot-toast';

const ShoppingList = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMeals, setLoadingMeals] = useState(false);

  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchList = async () => {
    try {
      const response = await shoppingLists.getOne(id);
      setList(response.data);
    } catch (error) {
      toast.error('Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await shoppingLists.removeItem(id, itemId);
      setList(response.data);
      toast.success('Item removed');
      
      // Refresh meal suggestions if list not empty
      if (response.data.items.length > 0) {
        generateMealSuggestions(response.data.items);
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const generateMealSuggestions = async (items = list?.items) => {
    if (!items || items.length === 0) return;

    setLoadingMeals(true);
    try {
      // Extract product titles for meal suggestions
      const itemNames = items.map(item => item.product.title);
      
      const response = await products.getMealSuggestions(itemNames);
      await shoppingLists.updateMeals(id, response.data.meals);
      
      setList(prev => ({
        ...prev,
        mealSuggestions: response.data.meals
      }));
      
      toast.success('Meal suggestions updated!');
    } catch (error) {
      toast.error('Failed to generate meal suggestions');
    } finally {
      setLoadingMeals(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!list) {
    return <div className="text-center">Shopping list not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{list.name}</h1>
        <p className="text-gray-600 mt-2">
          {list.items.length} items • Last updated {new Date(list.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Shopping Items */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shopping Items</h2>
            
            {list.items.length === 0 ? (
              <p className="text-gray-500">No items in your list yet</p>
            ) : (
              <div className="space-y-3">
                {list.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.title}</h4>
                      <p className="text-sm text-gray-600">
                        ${item.product.price?.toFixed(2) || 'N/A'} • {item.product.source}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Search: "{item.searchQuery}"
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {list.items.length > 0 && (
              <button
                onClick={() => generateMealSuggestions()}
                disabled={loadingMeals}
                className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                <FiRefreshCw className={loadingMeals ? 'animate-spin' : ''} />
                Generate Meal Suggestions
              </button>
            )}
          </div>
        </div>

        {/* Meal Suggestions */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Meal Suggestions</h2>
            
            {loadingMeals ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : list.mealSuggestions.length === 0 ? (
              <p className="text-gray-500">
                Add items to your list to get meal suggestions
              </p>
            ) : (
              <div className="space-y-4">
                {list.mealSuggestions.map((meal, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-sm mb-1">Ingredients:</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {meal.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-sm mb-1">Instructions:</h4>
                      <p className="text-sm text-gray-600">{meal.instructions}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Nutrition Facts:</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>Calories: {meal.nutritionFacts.calories}</p>
                          <p>Protein: {meal.nutritionFacts.protein}</p>
                          <p>Carbs: {meal.nutritionFacts.carbs}</p>
                          <p>Fat: {meal.nutritionFacts.fat}</p>
                          <p>Fiber: {meal.nutritionFacts.fiber}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Prep Time:</span> {meal.prepTime}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Servings:</span> {meal.servings}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;

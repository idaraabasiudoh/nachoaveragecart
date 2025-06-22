import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import Plate3D from '../components/Plate3D';

// Import specific functions from API to avoid circular dependencies
import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_URL}/api`;

// API functions directly defined here to avoid circular dependencies
const getShoppingList = (id) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/shopping-lists/${id}`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  });
};

const updateMeals = (listId, meals) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_URL}/shopping-lists/${listId}/meals`, { meals }, {
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  });
};

const getMealSuggestions = (items) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/products/meal-suggestions`, { items }, {
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  });
};

const IngredientSelector = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [generatingRecipes, setGeneratingRecipes] = useState(false);

  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchList = async () => {
    try {
      const response = await getShoppingList(id);
      setList(response.data);
      
      // Extract ingredient names from the shopping list items
      const ingredientNames = response.data.items.map(item => item.product.title);
      setIngredients(ingredientNames);
    } catch (error) {
      toast.error('Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecipes = async () => {
    if (selectedIngredients.length === 0) {
      toast.error('Please select at least one ingredient');
      return;
    }
    
    setGeneratingRecipes(true);
    try {
      // Call API to generate meal suggestions based on selected ingredients
      const response = await getMealSuggestions(selectedIngredients);
      
      // Update the shopping list with new meal suggestions
      await updateMeals(id, response.data.meals);
      
      toast.success('Recipes generated successfully!');
      navigate(`/list/${id}`);
    } catch (error) {
      toast.error('Failed to generate recipes');
      console.error('Error generating recipes:', error);
    } finally {
      setGeneratingRecipes(false);
    }
  };
  
  // This function will be passed to Plate3D component to receive selected ingredients
  const onIngredientsSelected = (kept) => {
    setSelectedIngredients(kept);
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
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white min-h-screen">
      {/* Header with navigation and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="text-blue-500 mr-2">🧪</span> Ingredient Selector
          </h1>
          <p className="text-gray-600 mt-2">
            Choose ingredients from your shopping list to create delicious recipes
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/list/${id}`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 border border-gray-200 shadow-md"
          >
            <FiArrowLeft />
            Back to List
          </button>
          <button
            onClick={handleGenerateRecipes}
            disabled={generatingRecipes || selectedIngredients.length === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md ${selectedIngredients.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400'} disabled:opacity-50`}
          >
            {generatingRecipes ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <FiCheck className="text-lg" />
            )}
            Generate Recipes
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        {ingredients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 text-lg mb-4">No ingredients found in your shopping list</p>
            <button 
              onClick={() => navigate(`/list/${id}`)}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
            >
              Back to Shopping List
            </button>
          </div>
        ) : (
          <>
            {/* Selected ingredients summary - only show if there are selections */}
            {selectedIngredients.length > 0 && (
              <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-bold text-lg text-gray-800">Your Recipe Ingredients</h3>
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{selectedIngredients.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map((ingredient, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center shadow-sm border border-blue-200">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 3D Ingredient Selector Component */}
            <Plate3D initialIngredients={ingredients} onIngredientsSelected={onIngredientsSelected} />
          </>
        )}
      </div>
    </div>
  );
};

export default IngredientSelector;

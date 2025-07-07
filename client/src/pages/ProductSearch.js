import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUpload, FiShoppingCart } from 'react-icons/fi';
import { products, shoppingLists } from '../services/api';
import toast from 'react-hot-toast';

const ProductSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleTextSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await products.search(searchQuery);
      console.log('Search response products:', response.data.products);
      // Create a new object with the new search at the beginning
      setSearchResults({
        [searchQuery]: response.data.products,
        ...searchResults
      });
      setSearchQuery('');
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      // Process image to get items
      const imageResponse = await products.processImage(formData);
      const items = imageResponse.data.items;

      // Search for each item
      let newResults = {};
      for (const item of items) {
        const searchResponse = await products.search(item);
        // Add each new item to the beginning of the results object
        newResults[item] = searchResponse.data.products;
      }
      
      // Update state with new items first, then existing items
      setSearchResults(prev => ({
        ...newResults,
        ...prev
      }));

      toast.success(`Found ${items.length} items in image`);
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (query, product) => {
    const itemId = `${query}-${product.title}`;
    const isSelected = selectedItems.some(item => 
      item.id === itemId
    );

    if (isSelected) {
      setSelectedItems(selectedItems.filter(item => item.id !== itemId));
    } else {
      setSelectedItems([...selectedItems, {
        id: itemId,
        searchQuery: query,
        product
      }]);
    }
  };

  const addToShoppingList = async () => {
    if (selectedItems.length === 0) {
      toast.error('No items selected');
      return;
    }

    try {
      // Create new shopping list or use existing
      const listsResponse = await shoppingLists.getAll();
      let listId;

      if (listsResponse.data.length === 0) {
        const newList = await shoppingLists.create({ name: 'My Shopping List' });
        listId = newList.data._id;
      } else {
        listId = listsResponse.data[0]._id;
      }

      // Add items to list
      for (const item of selectedItems) {
        await shoppingLists.addItem(listId, {
          searchQuery: item.searchQuery,
          product: item.product
        });
      }

      toast.success('Items added to shopping list');
      navigate(`/list/${listId}`);
    } catch (error) {
      toast.error('Failed to add items');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Search Products</h1>

      {/* Search Options */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Text Search */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiSearch className="mr-2" /> Search by Text
            </h2>
            <form onSubmit={handleTextSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter product name..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Search
              </button>
            </form>
          </div>

          {/* Image Upload */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiUpload className="mr-2" /> Upload Shopping List Image
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {Object.keys(searchResults).length > 0 && (
        <div className="space-y-8">
          {Object.entries(searchResults).map(([query, products]) => (
            <div key={query} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Results for "{query}"</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => {
                  const itemId = `${query}-${product.title}`;
                  const isSelected = selectedItems.some(item => item.id === itemId);
                  
                  // Debug logging for each product
                  console.log(`Product ${index} details:`, {
                    title: product.title,
                    link: product.link,
                    redirect_link: product.redirect_link,
                    hasLink: !!product.link,
                    hasRedirectLink: !!product.redirect_link,
                    linkToUse: product.redirect_link || product.link || product.product_link
                  });
                  
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleItemSelection(query, product)}
                    >
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-32 object-contain mb-3"
                        />
                      )}
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{product.title}</h4>
                      <p className="text-lg font-bold text-primary-600">
                        ${product.price?.toFixed(2) || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">{product.source}</p>
                      <div className="mt-2 text-sm">
                        <span className="text-yellow-500">★</span> {product.rating}
                        {product.reviews && ` (${product.reviews} reviews)`}
                      </div>
                      <div className="mt-3">
                        <a 
                          href={product.product_link || product.link || `https://www.google.com/search?q=${encodeURIComponent(product.title)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                        >
                          View Product <span className="ml-1">↗</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Add to Shopping List Button */}
          {selectedItems.length > 0 && (
            <div className="fixed bottom-8 right-8">
              <button
                onClick={addToShoppingList}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all"
              >
                <FiShoppingCart />
                Add {selectedItems.length} items to list
              </button>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;

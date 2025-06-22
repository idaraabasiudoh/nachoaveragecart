import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiShoppingCart, FiList } from 'react-icons/fi';
import { shoppingLists } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await shoppingLists.getAll();
      setLists(response.data);
    } catch (error) {
      toast.error('Failed to load shopping lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    
    try {
      const response = await shoppingLists.create({
        name: newListName || 'My Shopping List'
      });
      
      setLists([response.data, ...lists]);
      setNewListName('');
      setShowCreateModal(false);
      toast.success('Shopping list created!');
    } catch (error) {
      toast.error('Failed to create list');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <FiPlus /> New List
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/search"
          className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow"
        >
          <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 mr-4">
            <FiSearch size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Search Products</h2>
            <p className="text-gray-600">Find products by text or image</p>
          </div>
        </Link>

        <div
          onClick={() => setShowCreateModal(true)}
          className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 mr-4">
            <FiShoppingCart size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Create Shopping List</h2>
            <p className="text-gray-600">Start a new shopping list</p>
          </div>
        </div>
      </div>

      {/* Shopping Lists */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiList className="mr-2" /> Your Shopping Lists
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You don't have any shopping lists yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 text-primary-500 hover:underline"
            >
              Create your first list
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <Link
                key={list._id}
                to={`/list/${list._id}`}
                className="border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <h3 className="font-medium mb-2">{list.name}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{list.items.length} items</span>
                  <span>{new Date(list.updatedAt).toLocaleDateString()}</span>
                </div>
                {list.mealSuggestions.length > 0 && (
                  <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                    {list.mealSuggestions.length} meal suggestions available
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Shopping List</h2>
            
            <form onSubmit={handleCreateList}>
              <div className="mb-4">
                <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
                  List Name
                </label>
                <input
                  type="text"
                  id="listName"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="My Shopping List"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

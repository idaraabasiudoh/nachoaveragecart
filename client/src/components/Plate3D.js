import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to get emoji for an ingredient
function getEmoji(name) {
  // Map common ingredients to emojis
  const emojiMap = {
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    lemon: "🍋",
    strawberry: "🍓",
    grapes: "🍇",
    watermelon: "🍉",
    pineapple: "🍍",
    mango: "🥭",
    coconut: "🥥",
    kiwi: "🥝",
    tomato: "🍅",
    eggplant: "🍆",
    potato: "🥔",
    carrot: "🥕",
    corn: "🌽",
    pepper: "🌶️",
    garlic: "🧄",
    onion: "🧅",
    mushroom: "🍄",
    broccoli: "🥦",
    lettuce: "🥬",
    cucumber: "🥒",
    avocado: "🥑",
    bread: "🍞",
    cheese: "🧀",
    egg: "🥚",
    meat: "🥩",
    chicken: "🍗",
    bacon: "🥓",
    fish: "🐟",
    shrimp: "🍤",
    rice: "🍚",
    pasta: "🍝",
    pizza: "🍕",
    burger: "🍔",
    taco: "🌮",
    burrito: "🌯",
    sandwich: "🥪",
    milk: "🥛",
    coffee: "☕",
    tea: "🍵",
    cake: "🍰",
    cookie: "🍪",
    chocolate: "🍫",
    ice: "🧊",
    salt: "🧂",
    butter: "🧈",
    oil: "🫗",
    honey: "🍯",
    sugar: "🧁",
    flour: "🌾",
    spice: "🌶️",
    herb: "🌿",
    sauce: "🥫",
    soup: "🍲",
    salad: "🥗",
    juice: "🧃",
    water: "💧",
    wine: "🍷",
    beer: "🍺",
    cocktail: "🍹",
  };

  // Convert name to lowercase for case-insensitive matching
  const lowerName = name.toLowerCase();
  
  // Check for exact matches
  if (emojiMap[lowerName]) {
    return emojiMap[lowerName];
  }
  
  // Check for partial matches
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lowerName.includes(key)) {
      return emoji;
    }
  }
  
  // Default emoji if no match is found
  return "🍽️";
}

function Plate3D({ initialIngredients, onIngredientsSelected }) {
  const [cards, setCards] = useState(initialIngredients);
  const [kept, setKept] = useState([]);

  const onSwipe = useCallback(
    (name, direction) => {
      setCards((prev) => prev.filter((c) => c !== name));
      if (direction === "right") {
        const updatedKept = [...kept, name];
        setKept(updatedKept);
        // Notify parent component about selected ingredients
        if (onIngredientsSelected) {
          onIngredientsSelected(updatedKept);
        }
      }
    },
    [kept, onIngredientsSelected]
  );

  const onReset = () => {
    setCards(initialIngredients);
    setKept([]);
    // Notify parent component about reset
    if (onIngredientsSelected) {
      onIngredientsSelected([]);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 py-6">
      {/* Instruction Header */}
      <div className="w-full text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Select Your Ingredients</h2>
        <p className="text-gray-600 text-sm">Swipe right to use in recipes, left to discard</p>
      </div>
      
      {/* Main Content Area */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Cards Area */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative w-72 h-96 mb-6">
            <AnimatePresence>
              {cards.map((name, i) => (
                <motion.div
                  key={name}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(_, info) => {
                    const threshold = 100;
                    if (info.offset.x > threshold) onSwipe(name, "right");
                    else if (info.offset.x < -threshold) onSwipe(name, "left");
                  }}
                  initial={{ scale: 0.95, y: i * 8, opacity: 1 }}
                  animate={{ scale: 1, y: i * 8, opacity: 1 }}
                  exit={{
                    x: kept.includes(name) ? 500 : -500,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-0 left-0 w-72 h-96 bg-white text-gray-800 rounded-2xl shadow-lg flex flex-col items-center justify-center border border-gray-200 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Card Content */}
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-50 to-transparent opacity-50"></div>
                  <div className="text-8xl mb-4 filter drop-shadow-lg">{getEmoji(name)}</div>
                  <div className="text-2xl font-bold capitalize mb-2 text-gray-800">{name}</div>
                  
                  {/* Swipe Indicators */}
                  <div className="absolute bottom-6 w-full flex justify-between px-8 text-sm font-medium">
                    <div className="flex items-center text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Discard
                    </div>
                    <div className="flex items-center text-blue-500">
                      Cook
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Empty State */}
              {cards.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-0 left-0 w-72 h-96 bg-white text-blue-500 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="text-7xl mb-4">🍽️</div>
                  <h3 className="text-2xl font-bold mb-2 text-blue-500">Ready to Cook!</h3>
                  <p className="text-gray-600">You've gone through all ingredients. Time to create some delicious recipes!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md hover:cursor-pointer active:scale-95 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Ingredients
          </button>
        </div>

        {/* Selected Ingredients Display */}
        <div className="w-full md:w-1/2">
          <div className="w-full h-auto min-h-[250px] rounded-2xl overflow-hidden border border-blue-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <h3 className="text-gray-800 text-xl font-bold">Selected Ingredients</h3>
              <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{kept.length} items</span>
            </div>
            
            {kept.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <p className="text-center">Swipe right on ingredients<br />to add them to your selection</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3">
                {kept.map((name, i) => (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <div className="text-4xl mb-2 filter drop-shadow-lg">{getEmoji(name)}</div>
                    <div className="text-xs font-medium text-center text-gray-700 capitalize">{name}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plate3D;

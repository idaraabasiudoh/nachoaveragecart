const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const { getJson } = require('serpapi');
const multer = require('multer');
const fs = require('fs').promises;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/';
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

exports.uploadImage = upload.single('image');

exports.processImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Read image file
    const imagePath = req.file.path;
    const imageData = await fs.readFile(imagePath);

    // Process with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Extract all grocery items from this shopping list image. 
    Return only a JSON array of item names, nothing else. 
    Example: ["milk", "eggs", "bread"]`;

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: req.file.mimetype,
              data: imageData.toString('base64')
            }
          }
        ]
      }]
    });

    // Extract the text from the response
    const text = result.response.text();
    
    // Parse the JSON response
    const items = JSON.parse(text);

    // Clean up uploaded file
    await fs.unlink(imagePath);

    res.json({ items });
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const searchResults = await getJson({
      engine: 'google_shopping',
      q: query,
      api_key: process.env.SERPAPI_API_KEY,
      num: 10
    });

    const products = searchResults.shopping_results?.map(result => ({
      title: result.title,
      price: result.extracted_price || result.price,
      source: result.source,
      link: result.link,
      thumbnail: result.thumbnail,
      rating: result.rating,
      reviews: result.reviews
    })) || [];

    res.json({ query, products });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
};

exports.getMealSuggestions = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ]
    });
    
    const prompt = `Given these grocery items: ${items.join(', ')}
    
    Suggest 3 meal recipes that can be made with these ingredients.
    For each meal, provide:
    - Name
    - List of ingredients needed
    - Brief cooking instructions
    - Nutrition facts (calories, protein, carbs, fat, fiber)
    - Prep time
    - Number of servings
    
    Return the response as a JSON array with this exact structure:
    [
      {
        "name": "Meal Name",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "instructions": "Step by step instructions",
        "nutritionFacts": {
          "calories": 300,
          "protein": "15g",
          "carbs": "40g",
          "fat": "10g",
          "fiber": "5g"
        },
        "prepTime": "30 minutes",
        "servings": 4
      }
    ]`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    // Extract the text from the response
    let text = result.response.text();
    
    // Clean the response if it contains markdown code blocks
    if (text.includes('```json')) {
      // Extract content between ```json and ``` markers
      const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        text = jsonMatch[1].trim();
      }
    }
    
    // Additional cleanup for any other markdown or text artifacts
    text = text.replace(/^\s*```\s*|\s*```\s*$/g, '').trim();
    
    try {
      // Parse the JSON response
      const meals = JSON.parse(text);
      res.json({ meals });
    } catch (parseError) {
      console.error('JSON parsing error:', parseError, '\nRaw text:', text);
      res.status(500).json({ error: 'Failed to parse meal suggestions response' });
    }
  } catch (error) {
    console.error('Meal suggestion error:', error);
    res.status(500).json({ error: 'Failed to get meal suggestions' });
  }
};

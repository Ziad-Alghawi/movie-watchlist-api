import express from 'express';

// Import Routes
import movieRoutes from './routes/movieRoutes.js';

// Create Express app
const app = express();

// API Routes
app.use("/movies", movieRoutes);


// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

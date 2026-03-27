import { prisma } from "../config/db.js";


const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  // Verify that the movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  };

  // check if the movie is already in the user's watchlist
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  }); 
  // If the movie is already in the watchlist, return an error
   if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie is already in the user's watchlist" });
  };

  // Add the movie to the user's watchlist
  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    }
  });

  res.status(201).json({
    status: "success",
    data: {
      watchlistItem,
    }
  });
};

/** /////////////////////////////////////////////
 * Update watchlist item
 * Updates status, rating, or notes
 * Ensures only owner can update
 * Requires protect middleware
*///////////////////////////////////////////////

const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  // If item doesn't exist, return 404
  if(!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  };

  // Ensure only owner can update
  if (watchlistItem.userId !== req.user.id) {
    return res
    .status(403)
    .json({ error: "Not authorized to update this watchlist item" });
  }

  // Build update data object
  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  // Update the watchlist item
  const updatedItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    }
  });
}

/** /////////////////////////////////////////////
 * Remove movie from watchlist
 * Deletes watchlist item
 * Ensures only owner can delete
 * Requires protect middleware
*///////////////////////////////////////////////
const removeFromWatchlist = async (req, res) => {
  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  // If item doesn't exist, return 404
  if(!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({ error: "Not authorized to delete this watchlist item" });
  }
  
  // Delete the watchlist item
  await prisma.watchlistItem.delete({
    where: { id: req.params.id },
  });

  res.status(204).json({
    status: "success",
    message: "Watchlist item removed successfully",
  })
}

export { addToWatchlist, updateWatchlistItem, removeFromWatchlist };
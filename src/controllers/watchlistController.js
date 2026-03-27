import { prisma } from "../config/db.js";


const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes, userId } = req.body;

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
        userId: userId,
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
      userId,
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

export { addToWatchlist };
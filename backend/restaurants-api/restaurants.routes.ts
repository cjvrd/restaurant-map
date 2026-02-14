import { Router } from "express";
import { RestaurantsController } from "./restaurants.controller";

const restaurantsRouter = Router();

//Get All Restaurants
restaurantsRouter.get("/", RestaurantsController.getRestaurants);

//Add New Restaurant
restaurantsRouter.post("/", RestaurantsController.addRestaurant);

//Delete Restaurant
restaurantsRouter.delete("/:id", RestaurantsController.deleteRestaurant);

//Update Rating
restaurantsRouter.patch("/:id/rating", RestaurantsController.updateRating);

//Update Review
restaurantsRouter.patch("/:id/review", RestaurantsController.updateReview);

export default restaurantsRouter;

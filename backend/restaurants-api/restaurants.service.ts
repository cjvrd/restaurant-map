import { RestaurantsRepository } from "./restaurants.repository";
import { RestaurantReq } from "./restaurants.controller";

export const RestaurantsService = {
  getRestaurants: async () => RestaurantsRepository.getAllRestaurants(),

  addRestaurant: async (restaurant: RestaurantReq) =>
    RestaurantsRepository.createNewRestaurant(restaurant),

  deleteRestaurant: async (id: string) =>
    RestaurantsRepository.deleteRestaurant(id),

  updateRating: async (id: number, rating: number) =>
    RestaurantsRepository.updateRestaurantRating(id, rating),
};

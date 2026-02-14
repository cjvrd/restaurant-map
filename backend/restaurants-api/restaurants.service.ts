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

  updateReview: async (id: number, review: string | null) =>
    RestaurantsRepository.updateRestaurantReview(id, review),

  updateRestaurant: async (id: number, data: Partial<RestaurantReq>) =>
    RestaurantsRepository.updateRestaurant(id, data),
};

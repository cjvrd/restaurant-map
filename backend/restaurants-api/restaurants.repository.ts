import { db } from "../db";
import { RestaurantReq } from "./restaurants.controller";

export const RestaurantsRepository = {
  getAllRestaurants: async () =>
    db
      .selectFrom("Restaurant")
      .selectAll()
      .where("status", "=", "ENABLED")
      .execute(),

  createNewRestaurant: async (restaurant: RestaurantReq) =>
    db
      .insertInto("Restaurant")
      .values({
        name: restaurant.name,
        address: restaurant.address,
        coordinates: restaurant.coordinates,
        phone: restaurant.phone,
        website: restaurant.website,
        description: restaurant.description,
        updated_time: new Date(),
      })
      .returningAll()
      .executeTakeFirst(),

  deleteRestaurant: async (id: string) =>
    db
      .updateTable("Restaurant")
      .set({ status: "DELETED", updated_time: new Date() })
      .where("id", "=", Number(id))
      .returningAll()
      .executeTakeFirst(),
};

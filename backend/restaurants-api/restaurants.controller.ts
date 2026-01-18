import { Request, Response } from "express";
import { RestaurantsService } from "./restaurants.service";
import { z } from "zod";

const zCoordinates = z.object({
  lng: z.number(),
  lat: z.number(),
});

const zRestaurantReq = z.object({
  name: z.string().min(1, "name is required"),
  address: z.string().nullable(),
  coordinates: zCoordinates.nullable(),
  phone: z.string().nullable(), //TODO: add phone validation
  website: z.string().nullable(), //TODO: add website validation
  description: z.string().max(1000).nullable(),
});

export type RestaurantReq = z.infer<typeof zRestaurantReq>;

export const RestaurantsController = {
  getRestaurants: async (req: Request, res: Response) => {
    try {
      const restaurants = await RestaurantsService.getRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  },

  addRestaurant: async (req: Request, res: Response) => {
    try {
      const parsed = zRestaurantReq.safeParse(req.body);
      console.log("Parsed restaurant:", parsed);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const result = await RestaurantsService.addRestaurant(req.body);
      console.log("Added restaurant:", result);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to add restaurant" });
    }
  },

  deleteRestaurant: async (req: Request, res: Response) => {
    try {
      const result = await RestaurantsService.deleteRestaurant(req.params.id);
      if (!result)
        return res.status(404).json({ error: "Restaurant not found" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete restaurant" });
    }
  },
};

import { queryOptions, useQuery } from "@tanstack/react-query";
import { API_URL } from "./constants";

export type Restaurant = {
  id: number;
  created_time: string | Date;
  updated_time: string | Date;
  status: "ENABLED" | "DISABLED" | "DELETED";
  name: string;
  address: string | null;
  coordinates: { lng: number; lat: number } | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  rating: number | null;
};

const RestaurantQueries = {
  getAllRestaurants: () =>
    queryOptions<Restaurant[]>({
      queryKey: ["restaurants"],
      queryFn: async (): Promise<Restaurant[]> => {
        const response = await fetch(`${API_URL}/restaurants`);
        if (response.status !== 200)
          throw new Error("Failed to get restaurants list");
        const restaurants: Restaurant[] = await response.json();
        return restaurants;
      },
    }),
};

export const useGetAllRestaurants = () =>
  useQuery(RestaurantQueries.getAllRestaurants());

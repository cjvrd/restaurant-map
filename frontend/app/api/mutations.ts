import { mutationOptions, useMutation } from "@tanstack/react-query";
import { GlobalQueryClient } from "~/query-client";
import type { Restaurant } from "./queries";
import { API_URL } from "./constants";

type NewRestaurant = Omit<
  Restaurant,
  "id" | "created_time" | "updated_time" | "status"
>;

type RestaurantUpdate = Partial<
  Pick<Restaurant, "name" | "address" | "coordinates" | "phone" | "website" | "description">
>;

const RestaurantMutations = {
  addRestaurant: () => {
    return mutationOptions({
      mutationFn: async (restaurant: NewRestaurant) => {
        console.log("Adding restaurant:", restaurant);
        const response = await fetch(`${API_URL}/restaurants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(restaurant),
        });
        if (response.status !== 201)
          throw new Error("Failed to add restaurant");
        return response.json();
      },
      onSuccess: () => {
        GlobalQueryClient.invalidateQueries({ queryKey: ["restaurants"] });
      },
    });
  },
  deleteRestaurant: () => {
    return mutationOptions({
      mutationFn: async (restaurantId: string) => {
        const response = await fetch(`${API_URL}/restaurants/${restaurantId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "DELETED" }),
        });
        if (response.status !== 200)
          throw new Error("Failed to delete restaurant");
        return response.ok;
      },
      onSuccess: () => {
        GlobalQueryClient.invalidateQueries({ queryKey: ["restaurants"] });
      },
    });
  },
  updateRating: () => {
    return mutationOptions({
      mutationFn: async ({ id, rating }: { id: number; rating: number }) => {
        const response = await fetch(`${API_URL}/restaurants/${id}/rating`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        });
        if (response.status !== 200)
          throw new Error("Failed to update rating");
        return response.json();
      },
      onSuccess: () => {
        GlobalQueryClient.invalidateQueries({ queryKey: ["restaurants"] });
      },
    });
  },
  updateReview: () => {
    return mutationOptions({
      mutationFn: async ({
        id,
        review,
      }: {
        id: number;
        review: string | null;
      }) => {
        const response = await fetch(`${API_URL}/restaurants/${id}/review`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review }),
        });
        if (response.status !== 200)
          throw new Error("Failed to update review");
        return response.json();
      },
      onSuccess: () => {
        GlobalQueryClient.invalidateQueries({ queryKey: ["restaurants"] });
      },
    });
  },
  updateRestaurant: () => {
    return mutationOptions({
      mutationFn: async ({
        id,
        ...data
      }: { id: number } & RestaurantUpdate) => {
        const response = await fetch(`${API_URL}/restaurants/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.status !== 200)
          throw new Error("Failed to update restaurant");
        return response.json();
      },
      onSuccess: () => {
        GlobalQueryClient.invalidateQueries({ queryKey: ["restaurants"] });
      },
    });
  },
};

export const useAddRestaurant = () =>
  useMutation(RestaurantMutations.addRestaurant());
export const useDeleteRestaurant = () =>
  useMutation(RestaurantMutations.deleteRestaurant());
export const useUpdateRating = () =>
  useMutation(RestaurantMutations.updateRating());
export const useUpdateReview = () =>
  useMutation(RestaurantMutations.updateReview());
export const useUpdateRestaurant = () =>
  useMutation(RestaurantMutations.updateRestaurant());

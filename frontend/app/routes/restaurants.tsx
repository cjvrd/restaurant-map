import { useGetAllRestaurants } from "~/api/queries";
import { useUpdateRating } from "~/api/mutations";
import { StarRating } from "~/components/ui/star-rating";

export default function RestaurantsList() {
  const { data: restaurants } = useGetAllRestaurants();
  const updateRating = useUpdateRating();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        {restaurants?.map((restaurant) => (
          <div key={restaurant.id} className="border rounded-lg p-4">
            <h2 className="font-medium text-lg">{restaurant.name}</h2>
            {restaurant.address && (
              <p className="text-gray-600 text-sm">{restaurant.address}</p>
            )}
            <div className="mt-2">
              <StarRating
                value={restaurant.rating}
                onChange={(rating) =>
                  updateRating.mutate({ id: restaurant.id, rating })
                }
                size="md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

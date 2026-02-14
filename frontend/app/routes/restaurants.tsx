import { useState } from "react";
import { useGetAllRestaurants } from "~/api/queries";
import { useUpdateRating, useUpdateReview } from "~/api/mutations";
import { StarRating } from "~/components/ui/star-rating";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";

function ReviewEditor({
  restaurantId,
  review,
}: {
  restaurantId: number;
  review: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(review ?? "");
  const updateReview = useUpdateReview();

  const handleSave = () => {
    const value = text.trim() || null;
    updateReview.mutate(
      { id: restaurantId, review: value },
      { onSuccess: () => setEditing(false) },
    );
  };

  if (!editing) {
    return (
      <div className="mt-2">
        {review && <p className="text-sm text-gray-700">{review}</p>}
        <div className="mt-2 flex justify-end">
          {review ? (
            <Button
              size="sm"
              onClick={() => {
                setText(review);
                setEditing(true);
              }}
            >
              Edit review
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setText("");
                setEditing(true);
              }}
            >
              Add review
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={2000}
        rows={3}
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateReview.isPending}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditing(false)}
          disabled={updateReview.isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function RestaurantCard({
  restaurant,
  onRate,
}: {
  restaurant: {
    id: number;
    name: string;
    address: string | null;
    rating: number | null;
    review: string | null;
  };
  onRate: (rating: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <div
        className="cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-medium text-lg">{restaurant.name}</h2>
            {restaurant.address && (
              <p className="text-gray-600 text-sm">{restaurant.address}</p>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="text-gray-400 size-4 mt-1 shrink-0" />
          ) : (
            <ChevronDown className="text-gray-400 size-4 mt-1 shrink-0" />
          )}
        </div>
        <div className="mt-2">
          <StarRating value={restaurant.rating} onChange={onRate} size="md" />
        </div>
      </div>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ReviewEditor
            restaurantId={restaurant.id}
            review={restaurant.review}
          />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantsList() {
  const { data: restaurants } = useGetAllRestaurants();
  const updateRating = useUpdateRating();

  const wantToVisit = restaurants?.filter((r) => !r.review) ?? [];
  const visited = restaurants?.filter((r) => r.review) ?? [];

  return (
    <div className="mx-auto p-4 grid grid-cols-2 gap-4">
      <section className="flex flex-col items-center">
        <h1 className="text-xl font-semibold mb-3">Want to Visit</h1>
        <div className="w-full space-y-4">
          {wantToVisit.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onRate={(rating) =>
                updateRating.mutate({ id: restaurant.id, rating })
              }
            />
          ))}
        </div>
      </section>
      <section className="flex flex-col items-center">
        <h1 className="text-xl font-semibold mb-3">Visited</h1>
        <div className="w-full space-y-4">
          {visited.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onRate={(rating) =>
                updateRating.mutate({ id: restaurant.id, rating })
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

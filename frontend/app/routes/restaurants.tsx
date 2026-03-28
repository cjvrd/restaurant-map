import { useState } from "react";
import { useGetAllRestaurants, type Restaurant } from "~/api/queries";
import {
  useDeleteRestaurant,
  useUpdateRating,
  useUpdateReview,
} from "~/api/mutations";
import { StarRating } from "~/components/ui/star-rating";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  MapPin,
  Pencil,
  Phone,
  Plus,
  UtensilsCrossed,
} from "lucide-react";
import { RestaurantForm } from "~/components/add-edit-restaurant-form";

function AddReviewDialog({
  restaurant,
  open,
  onOpenChange,
}: {
  restaurant: {
    id: number;
    name: string;
    rating: number | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [rating, setRating] = useState(restaurant.rating ?? 0);
  const [reviewText, setReviewText] = useState("");
  const updateRating = useUpdateRating();
  const updateReview = useUpdateReview();

  const handleSave = () => {
    const review = reviewText.trim() || null;
    updateRating.mutate(
      { id: restaurant.id, rating },
      {
        onSuccess: () => {
          updateReview.mutate(
            { id: restaurant.id, review },
            { onSuccess: () => onOpenChange(false) },
          );
        },
      },
    );
  };

  const isPending = updateRating.isPending || updateReview.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Review for {restaurant.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <div className="mt-1">
              <StarRating value={rating} onChange={setRating} size="md" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Review</label>
            <Textarea
              className="mt-1"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="How was it?"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditRestaurantDialog({
  restaurant,
  open,
  onOpenChange,
  isVisited,
}: {
  restaurant: Restaurant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isVisited: boolean;
}) {
  const deleteRestaurant = useDeleteRestaurant();

  const handleDelete = () => {
    deleteRestaurant.mutate(String(restaurant.id), {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          if ((e.target as HTMLElement)?.closest?.("mapbox-search-listbox")) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit {restaurant.name}</DialogTitle>
        </DialogHeader>
        <RestaurantForm
          restaurant={restaurant}
          includeReview={isVisited}
          onSuccess={() => onOpenChange(false)}
          onDelete={handleDelete}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddRestaurantDialog({
  open,
  onOpenChange,
  includeReview,
  visit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  includeReview?: boolean;
  visit: "VISIT" | "VISITED";
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        onPointerDownOutside={(e) => {
          if ((e.target as HTMLElement)?.closest?.("mapbox-search-listbox")) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Restaurant</DialogTitle>
        </DialogHeader>
        <RestaurantForm
          onSuccess={() => onOpenChange(false)}
          includeReview={includeReview}
          visit={visit}
        />
      </DialogContent>
    </Dialog>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isVisited = restaurant.visit === "VISITED";

  return (
    <div className="rounded-xl border bg-white hover:shadow-lg transition-shadow overflow-hidden relative">
      <div className="p-4">
        <button
          className="text-red-500 hover:text-red-700 absolute top-5 right-5"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="size-4 cursor-pointer" />
        </button>
        <h2 className="font-semibold text-lg">{restaurant.name}</h2>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5 min-h-5">
          {restaurant.address ? (
            <>
              <MapPin className="size-3.5 shrink-0" />
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:underline"
              >
                {restaurant.address}
              </a>
            </>
          ) : (
            <>
              <MapPin className="size-3.5 shrink-0" />
              <span>No Location</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5 min-h-5">
          <Phone className="size-3.5 shrink-0" />
          {restaurant.phone ? (
            <a
              href={`tel:${restaurant.phone}`}
              className="truncate hover:underline"
            >
              {restaurant.phone}
            </a>
          ) : (
            <span>No Phone</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5 min-h-5">
          <Globe className="size-3.5 shrink-0" />
          {restaurant.website ? (
            <a
              href={
                restaurant.website.match(/^https?:\/\//)
                  ? restaurant.website
                  : `https://${restaurant.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:underline"
            >
              {restaurant.website}
            </a>
          ) : (
            <span>No Website</span>
          )}
        </div>

        {isVisited && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between min-h-8">
              <StarRating value={restaurant.rating ?? 0} size="md" />
              {restaurant.review && (
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <ChevronUp className="size-4 cursor-pointer" />
                  ) : (
                    <ChevronDown className="size-4 cursor-pointer" />
                  )}
                </button>
              )}
            </div>
            <div
              className={`grid transition-all duration-200 ease-in-out ${expanded && restaurant.review ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                {restaurant.review && (
                  <p className="text-sm text-gray-600 mt-1.5">
                    {restaurant.review}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!isVisited && (
          <div className="border-t pt-3 mt-3 flex items-center justify-end gap-2">
            <Button size="sm" onClick={() => setAddReviewOpen(true)}>
              Add review
            </Button>
          </div>
        )}
      </div>

      {!isVisited && (
        <AddReviewDialog
          restaurant={restaurant}
          open={addReviewOpen}
          onOpenChange={setAddReviewOpen}
        />
      )}

      <EditRestaurantDialog
        restaurant={restaurant}
        open={editOpen}
        onOpenChange={setEditOpen}
        isVisited={isVisited}
      />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-gray-400">
      <UtensilsCrossed className="size-10 mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default function RestaurantsList() {
  const { data: restaurants } = useGetAllRestaurants();
  const [addWantToVisitOpen, setAddWantToVisitOpen] = useState(false);
  const [addVisitedOpen, setAddVisitedOpen] = useState(false);

  const wantToVisit = restaurants?.filter((r) => r.visit === "VISIT") ?? [];
  const visited = restaurants?.filter((r) => r.visit === "VISITED") ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Want to Visit
              </h1>
              <p className="text-gray-600">
                {wantToVisit.length} restaurant{wantToVisit.length !== 1 && "s"}
              </p>
            </div>
            <Button size="sm" onClick={() => setAddWantToVisitOpen(true)}>
              <Plus className="size-4 mr-1" />
              Add Restaurant
            </Button>
          </div>
          {wantToVisit.length === 0 ? (
            <EmptyState message="No restaurants on your wishlist yet." />
          ) : (
            <div className="space-y-4">
              {wantToVisit.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reviewed</h1>
              <p className="text-gray-600">
                {visited.length} restaurant{visited.length !== 1 && "s"}
              </p>
            </div>
            <Button size="sm" onClick={() => setAddVisitedOpen(true)}>
              <Plus className="size-4 mr-1" />
              Add Restaurant
            </Button>
          </div>
          {visited.length === 0 ? (
            <EmptyState message="You haven't visited any restaurants yet." />
          ) : (
            <div className="space-y-4">
              {visited.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </section>
      </div>

      <AddRestaurantDialog
        open={addWantToVisitOpen}
        onOpenChange={setAddWantToVisitOpen}
        visit="VISIT"
      />
      <AddRestaurantDialog
        open={addVisitedOpen}
        onOpenChange={setAddVisitedOpen}
        includeReview
        visit="VISITED"
      />
    </div>
  );
}

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Spinner } from "~/components/ui/spinner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { StarRating } from "~/components/ui/star-rating";
import {
  useAddRestaurant,
  useUpdateRestaurant,
  useUpdateRating,
  useUpdateReview,
} from "~/api/mutations";
import type { Restaurant } from "~/api/queries";
import { useForm } from "react-hook-form";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { AddressAutofill } from "@mapbox/search-js-react";
import { accessToken } from "./map";
import { useState } from "react";
import { Trash2 } from "lucide-react";

type FormValues = {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
};

type RestaurantFormProps = {
  restaurant?: Restaurant;
  includeReview?: boolean;
  onSuccess?: () => void;
  onDelete?: () => void;
};

export function RestaurantForm({
  restaurant,
  includeReview,
  onSuccess,
  onDelete,
}: RestaurantFormProps) {
  const isEdit = !!restaurant;

  const addRestaurantMutation = useAddRestaurant();
  const updateRestaurantMutation = useUpdateRestaurant();
  const updateRatingMutation = useUpdateRating();
  const updateReviewMutation = useUpdateReview();

  const [coordinates, setCoordinates] = useState<{
    lng: number;
    lat: number;
  } | null>(restaurant?.coordinates ?? null);
  const [rating, setRating] = useState(restaurant?.rating ?? 0);
  const [reviewText, setReviewText] = useState(restaurant?.review ?? "");

  const form = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      name: restaurant?.name ?? "",
      address: restaurant?.address ?? "",
      phone: restaurant?.phone ?? "",
      website: restaurant?.website ?? "",
      description: restaurant?.description ?? "",
    },
  });

  const isPending =
    addRestaurantMutation.isPending ||
    updateRestaurantMutation.isPending ||
    updateRatingMutation.isPending ||
    updateReviewMutation.isPending;

  const onSubmit = (values: FormValues) => {
    if (isEdit) {
      updateRestaurantMutation.mutate(
        {
          id: restaurant.id,
          name: values.name,
          address: values.address || null,
          coordinates: coordinates ?? undefined,
          phone: values.phone || null,
          website: values.website || null,
          description: values.description || null,
        },
        {
          onSuccess: () => {
            if (includeReview && rating > 0) {
              updateRatingMutation.mutate(
                { id: restaurant.id, rating },
                {
                  onSuccess: () => {
                    const review = reviewText.trim() || null;
                    updateReviewMutation.mutate(
                      { id: restaurant.id, review },
                      { onSuccess: () => onSuccess?.() },
                    );
                  },
                },
              );
            } else {
              onSuccess?.();
            }
          },
        },
      );
    } else {
      addRestaurantMutation.mutate(
        {
          name: values.name,
          address: values.address ?? null,
          coordinates: coordinates ?? null,
          phone: values.phone ?? null,
          website: values.website ?? null,
          description: values.description ?? null,
          rating: includeReview && rating > 0 ? rating : null,
          review: includeReview && reviewText.trim() ? reviewText.trim() : null,
        },
        {
          onSuccess: () => {
            form.reset();
            setCoordinates(null);
            setRating(0);
            setReviewText("");
            onSuccess?.();
          },
        },
      );
    }
  };

  const isError =
    addRestaurantMutation.isError || updateRestaurantMutation.isError;

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-5xl w-full mx-auto">
        <div>
          {!isEdit && addRestaurantMutation.isSuccess ? (
            <div className="space-y-4" role="status" aria-live="polite">
              <h2 className="text-2xl font-semibold text-center">
                Restaurant added successfully!
              </h2>
              <p className="text-center">
                The restaurant has been added to the database.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => addRestaurantMutation.reset()}
                  variant="default"
                >
                  Add Another Restaurant
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Restaurant name is required",
                    maxLength: { value: 100, message: "Max 100 characters" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="p-1">Restaurant Name *</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          maxLength={100}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  rules={{
                    maxLength: { value: 200, message: "Max 200 characters" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="p-1">Address</FormLabel>
                      <FormControl>
                        <AddressAutofill
                          accessToken={accessToken}
                          onRetrieve={(response) => {
                            const feature = response.features?.[0];
                            const coords = feature?.geometry?.coordinates;
                            if (coords) {
                              setCoordinates({
                                lng: coords[0],
                                lat: coords[1],
                              });
                            }
                          }}
                        >
                          <Input
                            disabled={isPending}
                            {...field}
                            maxLength={200}
                          />
                        </AddressAutofill>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  rules={{
                    maxLength: { value: 20, message: "Max 20 characters" },
                    validate: (value) => {
                      if (!value) return true;
                      try {
                        const phoneNumber = parsePhoneNumberWithError(
                          value,
                          "AU",
                        );
                        if (!phoneNumber.isValid()) {
                          return "Invalid phone number";
                        }
                        return true;
                      } catch (error) {
                        return "Invalid phone number";
                      }
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="p-1">Phone</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} maxLength={20} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  rules={{
                    maxLength: { value: 200, message: "Max 200 characters" },
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                      message: "Invalid website URL",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="p-1">Website</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          maxLength={200}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{
                    maxLength: { value: 500, message: "Max 500 characters" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="p-1">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isPending}
                          {...field}
                          maxLength={500}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {includeReview && (
                  <>
                    <div>
                      <label className="text-sm font-medium p-1">Rating</label>
                      <div className="mt-1">
                        <StarRating
                          value={rating}
                          onChange={setRating}
                          size="md"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium p-1">Review</label>
                      <Textarea
                        className="mt-1"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        maxLength={2000}
                        rows={4}
                        placeholder="How was it?"
                        disabled={isPending}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-between gap-2">
                  {onDelete ? (
                    <Button
                      type="button"
                      onClick={onDelete}
                      disabled={isPending}
                    >
                      <Trash2 />
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Spinner className="mr-2" />
                        {isEdit ? "Saving..." : "Adding..."}
                      </>
                    ) : isEdit ? (
                      "Save"
                    ) : (
                      "Add Restaurant"
                    )}
                  </Button>
                </div>

                {isError && (
                  <div
                    className="text-red-600 text-center p-2 border border-red-300 rounded bg-red-50"
                    role="alert"
                  >
                    {isEdit
                      ? "Failed to update restaurant. Please try again."
                      : "Failed to add restaurant. Please try again."}
                  </div>
                )}
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

export const AddRestaurantForm = RestaurantForm;

export default function AddRestaurant() {
  return (
    <div>
      <h1 className="text-3xl font-medium text-center mt-4 mb-2">
        Add a New Restaurant
      </h1>
      <div className="p-4 border rounded">
        <RestaurantForm />
      </div>
    </div>
  );
}

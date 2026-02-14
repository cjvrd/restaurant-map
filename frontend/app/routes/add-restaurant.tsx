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
import { useAddRestaurant } from "~/api/mutations";
import { useForm } from "react-hook-form";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { AddressAutofill } from "@mapbox/search-js-react";
import { accessToken } from "./map";
import { useState } from "react";

type FormValues = {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
};

export function AddRestaurantForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const addRestaurantMutation = useAddRestaurant();
  const [coordinates, setCoordinates] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  const form = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      website: "",
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    addRestaurantMutation.mutate(
      {
        name: values.name,
        address: values.address ?? null,
        coordinates: coordinates ?? null,
        phone: values.phone ?? null,
        website: values.website ?? null,
        description: values.description ?? null,
        rating: null,
      },
      {
        onSuccess: () => {
          form.reset();
          setCoordinates(null);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-5xl w-full mx-auto">
        <div>
          {addRestaurantMutation.isSuccess ? (
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
                          disabled={addRestaurantMutation.isPending}
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
                            const coords =
                              response.features?.[0]?.geometry?.coordinates;
                            setCoordinates({
                              lng: coords[0],
                              lat: coords[1],
                            });
                          }}
                        >
                          <Input
                            disabled={addRestaurantMutation.isPending}
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
                        <Input
                          disabled={addRestaurantMutation.isPending}
                          {...field}
                          maxLength={20}
                        />
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
                          disabled={addRestaurantMutation.isPending}
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
                          disabled={addRestaurantMutation.isPending}
                          {...field}
                          maxLength={500}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={addRestaurantMutation.isPending}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={addRestaurantMutation.isPending}
                  >
                    {addRestaurantMutation.isPending ? (
                      <>
                        <Spinner className="mr-2" />
                        Adding...
                      </>
                    ) : (
                      "Add Restaurant"
                    )}
                  </Button>
                </div>

                {addRestaurantMutation.isError && (
                  <div
                    className="text-red-600 text-center p-2 border border-red-300 rounded bg-red-50"
                    role="alert"
                  >
                    Failed to add restaurant. Please try again.
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

export default function AddRestaurant() {
  return (
    <div>
      <h1 className="text-3xl font-medium text-center mt-4 mb-2">
        Add a New Restaurant
      </h1>
      <div className="p-4 border rounded">
        <AddRestaurantForm />
      </div>
    </div>
  );
}

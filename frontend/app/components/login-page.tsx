import { UtensilsCrossed } from "lucide-react";
import { Button } from "~/components/ui/button";

export function LoginPage({
  onLogin,
  onSignUp,
}: {
  onLogin: () => void;
  onSignUp: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full px-4">
        <div className="text-center space-y-2 pt-10">
          <h1 className="text-2xl font-bold">Welcome to Restaurantier.</h1>
          <p className="text-muted-foreground">
            Discover your favourite restaurants.
          </p>
          <img
            src="https://static.vecteezy.com/system/resources/previews/012/319/441/non_2x/red-restaurant-icon-fork-dish-and-spoon-free-vector.jpg"
            alt="Restaurantier"
            className="h-auto w-200"
          />
        </div>
        <div className="w-full space-y-3">
          <Button size="lg" className="w-full" onClick={onLogin}>
            <UtensilsCrossed />
            Log In
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={onSignUp}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}

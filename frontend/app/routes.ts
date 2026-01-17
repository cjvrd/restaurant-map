import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/map.tsx"),
  route("add-restaurant", "routes/add-restaurant.tsx"),
] satisfies RouteConfig;

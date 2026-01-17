import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("contact-us", "routes/contact-us.tsx"),
  route("contact-list", "routes/contact-list.tsx"),
  route("map", "routes/map.tsx"),
  route("add-restaurant", "routes/add-restaurant.tsx"),
] satisfies RouteConfig;

import type { Route } from "./+types/home";
import { HomePage } from "@views/homePage/homePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WaltBoard" },
    { name: "description", content: "Walter's kanban board." },
  ];
}

export default function Home() {
  return <HomePage />;
}

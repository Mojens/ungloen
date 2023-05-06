import { readable } from "svelte/store";

export const BASE_URL = readable("http://localhost:8080");
export const forum_subjects = readable(["Årsopgørelse","Skat","Løn","Andet"]);
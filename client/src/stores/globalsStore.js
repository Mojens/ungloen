import { readable } from "svelte/store";
import { writable } from "svelte/store";

const savedUser = JSON.parse(localStorage.getItem("user"));
export const user = writable(savedUser || null);

export const BASE_URL = readable("http://localhost:8080");

export const isAuthenticated = writable(false);

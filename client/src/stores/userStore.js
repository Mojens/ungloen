import { writable } from "svelte/store";

const savedUser = JSON.parse(localStorage.getItem("user"));
export const user = writable(savedUser || null);

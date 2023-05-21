import { writable } from "svelte/store";

export const chatMessages = writable([]);

export const sentRequests = writable([]);

export const recievedRequests = writable([]);

export const whoIsOnline = writable([]);
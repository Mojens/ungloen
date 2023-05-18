import { writable } from "svelte/store";

export const whoJoinedChat = writable([]);

export const chatMessages = writable([]);

export const sentRequests = writable([]);

export const recievedRequests = writable([]);
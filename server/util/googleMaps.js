import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from 'dotenv/config';

const client = new Client({});

export async function calculateDistance(origin, destination) {
  try {
    const response = await client.directions({
      params: {
        origin: origin,
        destination: destination,
        key: process.env.GOOGLE_API,
      },
      timeout: 1000,
    });
    const distance = response.data.routes[0].legs[0].distance.value;
    return distance / 1000;
  } catch (e) {
    console.error(e.response.data.error_message);
    return "Kunne ikke beregne afstand";
  }
}
export async function autocompletePlaces(input) {
  try {
    const response = await client.placeAutocomplete({
      params: {
        input: input,
        key: process.env.GOOGLE_API,
        components: "country:dk",
      },
      timeout: 1000,
    });
    return response.data.predictions;
  } catch (e) {
    console.error(e.response.data.error_message);
    return [];
  }
}
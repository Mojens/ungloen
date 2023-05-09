import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from 'dotenv/config';

const client = new Client({});

client
  .elevation({
    params: {
      locations: [{ lat: 45, lng: -110 }],
      key: process.env.GOOGLE_API,
    },
    timeout: 1000,
  })
  .then((r) => {
    console.log(r.data.results[0].elevation);
  })
  .catch((e) => {
    console.log(e.response.data.error_message);
  });

  async function calculateDistance(origin, destination) {
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
      return distance;
    } catch (e) {
      console.error(e.response.data.error_message);
      return null;
    }
  }
  const distance = await calculateDistance("Hovmålvej 74D, 2300 København S", "Rønnebærparken 56 1tv, 4000 Roskilde");
  console.log(distance);
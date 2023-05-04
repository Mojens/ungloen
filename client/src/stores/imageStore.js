import { writable } from "svelte/store";

const frontpagePhotos = [
    {
        src: "https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Blå penge gris",
      },
      {
        src: "https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Pige med shopping poser, og shopper online",
      },
      {
        src: "https://images.pexels.com/photos/853151/pexels-photo-853151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Kæreste par der shopper online",
      },
];

export const frontPageImages = writable(frontpagePhotos);

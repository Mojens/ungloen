<script>
  import { fade } from "svelte/transition";

  export let carouselPhotos = [];

  let index = 0;

  const next = () => {
    index = (index + 1) % carouselPhotos.length;
  };

  setInterval(next, 4000);
</script>

<div class="slider-container">
  {#each carouselPhotos as { src, alt }, i}
    <img
      class="slider-img"
      transition:fade={{ delay: 0, duration: 500 }}
      style="opacity: {i === index ? 1 : 0}"
      {src}
      {alt}
    />
  {/each}
</div>

<style>
    .slider-container {
    position: relative;
    height: 500px; /* adjust to your desired height */
    width: 100%;
    overflow: hidden;
  }

  .slider-img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: 1;
    transition: opacity 0.5s ease-in-out;
  }
</style>

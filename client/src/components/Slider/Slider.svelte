<script>
    import { fade } from "svelte/transition";
  
    export let carouselPhotos = [];
  
    let index = 0;
  
    const next = () => {
      index = (index + 1) % carouselPhotos.length;
    };
  
    setInterval(next, 5000);
  </script>
  
  {#each carouselPhotos as { src, alt }, i}
    {#if i === index}
      <img transition:fade={{ delay: 0, duration: 0 }} src={src} alt={alt} />
    {/if}
  {/each}

  
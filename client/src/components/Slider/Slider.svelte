<script>
    import Carousel from "svelte-carousel";
    export let carouselPhotos = [];
</script>

<div class="slider-container center">
    <Carousel
        autoplay
        autoplayDuration={3500}
        arrows={false}
        dots={false}
        infinite={true}
    >
        {#each carouselPhotos as { src, alt }, i}
            <img class="slider-img" {src} {alt} />
        {/each}
    </Carousel>
</div>

<style>
    .slider-container {
        margin: 0 auto;
        width: 100%;
        height: 550px;
        overflow: hidden;
    }
    .slider-img {
        width: 100%;
        height: 550px;
        object-fit: cover;
    }
</style>

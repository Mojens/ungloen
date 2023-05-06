<script>
    import Carousel from "svelte-carousel";
    export let carouselPhotos = [];
</script>

<div class="slider-container center" style="max-width: 1000px; margin:0 auto;">
    <Carousel autoplay autoplayDuration={3500} arrows={false} dots={false} infinite={true}>
        {#each carouselPhotos as { src, alt }, i}
            <img class="slider-img" {src} {alt} style="max-width: 1000px; height: 550px;"/>
        {/each}
    </Carousel>
</div>



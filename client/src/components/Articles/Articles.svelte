<script>
    import Carousel from "svelte-carousel";

    export let articles = [];
    export let amountToShow = 2;
    export let amountOnScroll = 1;
</script>

<div id="articles">
    <hgroup>
        <h2 class="title-contact">Relevante artikler</h2>
        <h3>
            Her kan du finde artikler, som vi har fundet som vi mener er
            relevante for dig.
        </h3>
    </hgroup>
    <Carousel particlesToShow={amountToShow} particlesToScroll={amountOnScroll}>
        {#each articles as article}
            <article class="m-left">
                <header class="center">{article.title}</header>
                <img
                    src={article.imgURL}
                    alt={article.title}
                    class="article-img"
                />
                <footer class="card-footer-article-slider">
                    {article.intro_text}
                    <a class="card-end" href={article.url} target="_blank"
                        >Læs artikel</a
                    >
                    <span class="author">Skrevet af: {article.author}</span>
                </footer>
            </article>
        {/each}
    </Carousel>
</div>

<style>
    .author {
        font-style: italic;
        margin-top: 5px;
        font-size: small;
        float: left;
    }
    .card-footer-article-slider {
        height: 300px;
    }
    .m-left {
        margin-left: 10px;
    }
    .article-img {
        width: 412px;
        height: 275px;
        aspect-ratio: auto 412/275;
    }
</style>

<script>
    import { onMount } from "svelte";

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    let showButton = false;

    onMount(() => {
        window.addEventListener("scroll", handleScroll);
    });

    function handleScroll() {
        showButton = window.pageYOffset > 80;
    }
</script>

{#if showButton}
    <i
        on:click={scrollToTop}
        on:keyup={scrollToTop}
        class="fa fa-arrow-circle-up fa-4x scroll-to-top"
    />
{/if}

<style>
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #333;
        color: #fff;
        border: none;
        cursor: pointer;
        opacity: 0.8;
        font-size: 24px;
    }

    @media (prefers-color-scheme: dark) {
        .scroll-to-top {
            background-color: #fff;
            color: #333;
        }
    }

    .scroll-to-top:hover {
        opacity: 1;
    }
</style>

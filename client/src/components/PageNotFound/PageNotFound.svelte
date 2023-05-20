<script>
	export let pageTitle;
	document.title = pageTitle;

	import { Link } from "svelte-navigator";
</script>

<main class="container">
	<div class="grid">
		<div class="error-container">
			<h1 class="center title-contact error-title">404 - Siden blev ikke fundet</h1>
			<p class="center">Vi undskylder men denne side eksisterer ikke.</p>
			<Link class="center" to="/">Tilbage til forsiden</Link>
		</div>
	</div>
</main>

<style>
    .error-title {
        font-size: 3rem;
    }
    .error-container {
        margin-top: 20%;
        margin-bottom: 14%;
    }
</style>
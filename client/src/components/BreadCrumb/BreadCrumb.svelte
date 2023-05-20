<script>
	import { Link } from "svelte-navigator";

	export let breadCrumbs = [];
</script>

<nav
	aria-label="breadcrumb"
	class="share-dollar-nav"
>
	<ul>
		{#each breadCrumbs as breadCrumb}
			<li><Link to={breadCrumb.path}>{breadCrumb.title}</Link></li>
			{#if breadCrumb.path = ""}
				<li>{breadCrumb.title}</li>
			{/if}
		{/each}
	</ul>
</nav>

<style>
	.share-dollar-nav {
		position: relative;
		margin-left: 10%;
		top: 25px;
	}
</style>

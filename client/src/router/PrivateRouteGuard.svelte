<script>
	import { useNavigate, useLocation } from "svelte-navigator";
	import { user } from "../stores/globalsStore.js";

	const navigate = useNavigate();
	const location = useLocation();

	$: if (!$user) {
		navigate("/log-ind", {
			state: { from: $location.pathname },
			replace: true,
		});
	}
</script>

{#if $user}
	<slot />
{/if}

<script>
	import { useNavigate, useLocation } from "svelte-navigator";
	import { user, BASE_URL } from "../stores/globalsStore.js";
	import { onMount } from "svelte";

	const navigate = useNavigate();
	const location = useLocation();

	onMount(async () => {
		const response = await fetch(
			`${$BASE_URL}/api/private/auth/check-session`,
			{
				credentials: "include",
			}
		);
		const data = await response.json();
		if (response.status === 200) {
			user.set(data.user);
		} else {
			user.set(null);
			navigate("/log-ind", {
				state: { from: $location.pathname },
				replace: true,
			});
		}
	});
</script>

{#if $user}
	<slot />
{/if}

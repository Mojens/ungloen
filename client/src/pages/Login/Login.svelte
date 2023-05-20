<script>
	export let pageTitle;
	document.title = pageTitle;

	import { BASE_URL, user, invitations } from "../../stores/globalsStore.js";
	import { useNavigate } from "svelte-navigator";
	import { startLoading, stopLoading } from "../../util/loadingButton.js";
	import toastr from "toastr";
	import AuthLinks from "../../components/AuthLinks/AuthLinks.svelte";
	import io from "socket.io-client";

	const navigate = useNavigate();

	let email = "john_doe@emailprovider.com";
	let password = "";

	let loginButtonElement;

	async function listenForInvitations() {
		const response = await fetch(
			`${$BASE_URL}/api/private/sharedollar/teams/invite`,
			{
				credentials: "include",
			}
		);
		const data = await response.json();
		if (response.status === 200) {
			$invitations = data.invitations;
		}

		let socket = io($BASE_URL);
		socket.on("invitesRecieved", (data) => {
			if ($user.id === data.inviteTo.id) {
				invitations.update((invitations) => {
					invitations.push(data);
					return invitations;
				});
			}
		});
	}

	async function handleLogin() {
		startLoading(loginButtonElement);
        
		const response = await fetch(`${$BASE_URL}/api/auth/login`, {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});
		const data = await response.json();
		if (response.status === 200) {
			await listenForInvitations();
			toastr.success(data.message);
			user.set(data.user);
            stopLoading(loginButtonElement);
			navigate("/", { replace: true });
		} else {
			toastr.error(data.message);
			stopLoading(loginButtonElement);
		}
	}
</script>

<main class="container">
	<h1 class="title">Log ind på din profil</h1>
	<p>Indtast venligst dine loginoplysninger nedenfor.</p>
	<p class="p-end">
		Hvis du har glemt din adgangskode, kan du nulstille det ved at klikke på
		linket "Glemt adgangskode?".
	</p>
	<form on:submit|preventDefault={handleLogin}>
		<label for="email">Mailadresse</label>
		<input
			type="email"
			id="email"
			name="email"
			bind:value={email}
			placeholder="john_doe@emailprovider.dk"
			required
		/>

		<label for="password">Adgangskode</label>
		<input
			type="password"
			id="password"
			name="password"
			bind:value={password}
			placeholder="********"
			required
		/>
		<button
			type="submit"
			bind:this={loginButtonElement}>Log ind</button
		>
	</form>
	<AuthLinks path={location.pathname} />
</main>

<style>
	p {
		font-size: small;
		margin-bottom: 0;
	}
	label {
		font-weight: bold !important;
	}
</style>

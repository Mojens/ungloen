<script>
	export let pageTitle;
	document.title = pageTitle;

	import { BASE_URL } from "../../stores/globalsStore.js";
	import { useNavigate } from "svelte-navigator";
	import { startLoading, stopLoading } from "../../util/loadingButton.js";
	import toastr from "toastr";
	import AuthLinks from "../../components/AuthLinks/AuthLinks.svelte";

	const navigate = useNavigate();

	let verification_code = "";
	let phone = "";

	let verifyUserButtonElement;

	async function verifyUser() {
		startLoading(verifyUserButtonElement);
		
		const response = await fetch(`${$BASE_URL}/api/auth/verify}`, {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				verification_code,
				phone,
			}),
		});
		const data = await response.json();
		if (response.status === 200) {
			toastr.success(data.message);
			stopLoading(verifyUserButtonElement);
			navigate("/log-ind", { replace: true });
		} else {
			toastr.error(data.message);
			stopLoading(verifyUserButtonElement);
		}
	}
</script>

<main class="container">
	<h1 class="title down-m">Aktiver din bruger</h1>
	<p class="down-m">
		Indtast venligst din aktiveringskode du har modtaget på SMS.
	</p>
	<p class="p-end">
		Hvis du ikke kan finde din aktiveringskode, kan du få den tilsendt igen ved
		at klikke på linket <a href="/send-aktiveringskode">Send aktiveringskode</a
		>.
	</p>
	<form on:submit|preventDefault={verifyUser}>
		<div class="grid">
			<label for="phone"
				>Telefonnummer
				<input
					type="text"
					bind:value={phone}
					id="phone"
					name="phone"
					placeholder="XXXXXXXX"
					maxlength="8"
					minlength="8"
					required
				/>
			</label>
			<label for="verification_code"
				>Aktiveringskode
				<input
					type="text"
					bind:value={verification_code}
					id="verification_code"
					name="verification_code"
					placeholder="XXXXXXXX"
					maxlength="8"
					minlength="8"
					required
				/>
				<small
					>Din aktiveringskode vil ikke være gyldig længere efter brug</small
				>
			</label>
		</div>
		<button
			bind:this={verifyUserButtonElement}
			type="submit">Aktiver</button
		>
	</form>
	<AuthLinks path={location.pathname} />
</main>

<style>
	p {
		font-size: small !important;
	}
</style>

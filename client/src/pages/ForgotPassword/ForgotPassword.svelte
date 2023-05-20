<script>
    export let pageTitle;
    document.title = pageTitle;

    import toastr from "toastr";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import { startLoading, stopLoading } from "../../util/loadingButton.js";
    import AuthLinks from "../../components/AuthLinks/AuthLinks.svelte";

    let email = "";

    let forgotPasswordButtonElement;

    async function handleResetPassword() {
        startLoading(forgotPasswordButtonElement);

        const response = await fetch(`${$BASE_URL}/api/auth/forgot-password`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            stopLoading(forgotPasswordButtonElement);
        } else {
            toastr.error(data.message);
            stopLoading(forgotPasswordButtonElement);
        }
    }
</script>

<main class="container">
    <h1 class="title">Har du glemt din adgangskode ?</h1>
    <p class="p-end">
        Intet problem! Indtast venligst din mailadresse nedenfor, og vi vil
        sende dig et link til at nulstille dit password.
    </p>
    <form on:submit|preventDefault={handleResetPassword}>
        <label for="email">Mailadresse</label>
        <input
            type="email"
            id="email"
            name="email"
            bind:value={email}
            placeholder="john_doe@emailprovider.dk"
            required
        />
        <button type="submit" bind:this={forgotPasswordButtonElement}>Send link</button>
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

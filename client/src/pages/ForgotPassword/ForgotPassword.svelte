<script>
    import toastr from "toastr";
    import { BASE_URL } from "../../stores/globalsStore.js";

    let email = "";

    async function handleResetPassword() {
        const response = await fetch($BASE_URL + "/api/forgot-password", {
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
        } else {
            toastr.error(data.message);
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
        <button type="submit">Send link</button>
    </form>
    <div class="form-links">
        <a href="/log-ind">Allerede oprettet?</a>
        <span id="form-link-divider">|</span>
        <a href="/opret-bruger">Opret en bruger</a>
    </div>
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

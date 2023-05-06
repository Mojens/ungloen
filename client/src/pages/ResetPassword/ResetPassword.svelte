<script>
    document.title = "UngLøn | Nulstil adgangskode";
    import toastr from "toastr";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import { useParams } from "svelte-navigator";

    let token = "";

    const params = useParams();
    token = $params.token;

    let password = "";
    let confirm_password = "";

    async function handleResetPassword() {
        const response = await fetch($BASE_URL + "/api/reset-password", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                password,
                confirm_password,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            setTimeout(() => {
                window.location.href = "/log-ind";
            }, 2000);
        } else {
            toastr.error(data.message);
        }
    }

    async function checkToken() {
        const response = await fetch($BASE_URL + "/api/check-token", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
        } else {
            toastr.error(data.message);
        }
    }
    checkToken();
</script>

<main class="container">
    <h1 class="title">Nulstil din adgangskode</h1>
    <p class="p-end">Udfyld venligst din nye adgangskode.</p>
    <form on:submit|preventDefault={handleResetPassword}>
        <label for="password">Adgangskode</label>
        <input
            type="password"
            id="password"
            name="password"
            bind:value={password}
            placeholder="********"
            required
        />
        <label for="confirm_password">Bekræft Adgangskode</label>
        <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            bind:value={confirm_password}
            placeholder="********"
            required
        />
        <button type="submit">Nulstil adgangskode</button>
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

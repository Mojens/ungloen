<script>
    export let pageTitle;
    document.title = pageTitle;

    import toastr from "toastr";
    import { useNavigate, useParams } from "svelte-navigator";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import { onMount } from "svelte";

    const navigate = useNavigate();

    const params = useParams();
    let token = $params.token;

    let password = "";
    let confirm_password = "";

    async function handleResetPassword() {
        let buttonElement = document.getElementById("reset-password-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");
        const response = await fetch(`${$BASE_URL}/api/auth/reset-password`, {
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
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
            toastr.success(data.message);
            navigate("/log-ind", { replace: true });
        } else {
            toastr.error(data.message);
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
        }
    }

    async function checkToken() {
        const response = await fetch(`${$BASE_URL}/api/auth/check-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
            }),
        });
        const data = await response.json();
        if (response.status > 200) {
            toastr.error(data.message);
        }
    }

    onMount(async () => {
        await checkToken();
    });
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
        <button type="submit" id="reset-password-btn"
            >Nulstil adgangskode</button
        >
    </form>
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

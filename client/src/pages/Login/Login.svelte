<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { user } from "../../stores/userStore.js";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import toastr from "toastr";

    const navigate = useNavigate();
    const location = useLocation();

    let email = "";
    let password = "";

    async function handleLogin() {
        const response = await fetch($BASE_URL + "/api/login", {
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
            localStorage.setItem("user", JSON.stringify(data.user));
            toastr.success(data.message);
            user.set(data.user);
            const from = ($location.state && $location.state.from) || "/";
            navigate(from, { replace: true });
        } else {
            toastr.error(data.message);
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
        <button type="submit">Log ind</button>
    </form>
    <div class="form-links">
        <a href="/glemt-adgangskode">Glemt adgangskode?</a>
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

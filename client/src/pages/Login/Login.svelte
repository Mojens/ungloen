<script>
    document.title = "UngLøn | Log ind";
    import { useNavigate, useLocation } from "svelte-navigator";
    import { BASE_URL, user } from "../../stores/globalsStore.js";
    import toastr from "toastr";
    import AuthLinks from "../../components/AuthLinks/AuthLinks.svelte";
    import io from "socket.io-client";

    const navigate = useNavigate();

    let email = "john_doe@emailprovider.com";
    let password = "";

    async function handleLogin() {
        let buttonElement = document.getElementById("login-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");
        const response = await fetch($BASE_URL + "/api/auth/login", {
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
            
                buttonElement.removeAttribute("aria-busy");
                buttonElement.removeAttribute("class");
                localStorage.setItem("user", JSON.stringify(data.user));
                toastr.success(data.message);
                user.set(data.user);
                navigate("/", { replace: true });
            
        } else {
            toastr.error(data.message);
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
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
        <button type="submit" id="login-btn">Log ind</button>
    </form>
    <AuthLinks path={location.pathname}/>
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

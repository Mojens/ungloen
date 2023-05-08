<script>
    document.title = "UngLøn | Opret dig";
    import toastr from "toastr";
    import { useNavigate, useLocation } from "svelte-navigator";
    import { BASE_URL } from "../../stores/globalsStore.js";

    let email = "";
    let password = "";
    let confirm_password = "";
    let first_name = "";
    let last_name = "";
    let phone = "";

    const navigate = useNavigate();
    const location = useLocation();

    async function handleRegister() {
        let buttonElement = document.getElementById("register-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");
        phone.replace(" ", "");
        if (phone.includes("+45")) {
            phone = phone.replace("+45", "");
        }
        const response = await fetch($BASE_URL + "/api/register", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                password,
                confirm_password,
                phone,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            setTimeout(() => {
                buttonElement.removeAttribute("aria-busy");
                buttonElement.removeAttribute("class");
                toastr.success(data.message);
                const from =
                    ($location.state && $location.state.from) ||
                    "/aktiver-bruger";
                navigate(from, { replace: true });
            }, 1500);
        } else {
            toastr.error(data.message);
        }
    }
</script>

<main class="container">
    <h1 class="title-contact">Opret dig hos os idag !</h1>
    <p class="p-end">
        Udfyld venligst dine oplysninger for at oprette en konto.
    </p>
    <form on:submit|preventDefault={handleRegister}>
        <div class="grid">
            <label for="first_name">
                Fornavn og mellemnavn
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="Kasper peter"
                    bind:value={first_name}
                    required
                />
            </label>

            <label for="last_name">
                Efternavn
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    bind:value={last_name}
                    placeholder="Olsen"
                    required
                />
            </label>
        </div>
        <div class="grid">
            <label for="email">
                Mailadresse
                <input
                    type="text"
                    id="email"
                    name="email"
                    bind:value={email}
                    placeholder="john_doe@emailprovider.dk"
                    required
                />
            </label>

            <label for="phone">
                Telefonnummer
                <input
                    type="tel"
                    maxlength="8"
                    id="phone"
                    name="phone"
                    bind:value={phone}
                    placeholder="12345678"
                    required
                />
            </label>
        </div>
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
        <button type="submit" id="register-btn">Opret</button>
    </form>
    <div class="form-links">
        <a href="/log-ind">Allerede oprettet?</a>
        <span id="form-link-divider">|</span>
        <a href="/glemt-adgangskode">Glemt adgangskode?</a>
        <span id="form-link-divider">|</span>
        <a href="/aktiver-bruger">Aktiver din bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/send-aktiveringskode">Send aktiveringskode</a>
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

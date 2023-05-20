<script>
    export let pageTitle;
    document.title = pageTitle;

    import { useNavigate } from "svelte-navigator";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import { startLoading, stopLoading } from "../../util/loadingButton.js";
    import toastr from "toastr";
    import AuthLinks from "../../components/AuthLinks/AuthLinks.svelte";

    let email = "";
    let password = "";
    let confirm_password = "";
    let first_name = "";
    let last_name = "";
    let phone = "";

    let registerButtonElement;

    const navigate = useNavigate();

    async function handleRegister() {
        startLoading(registerButtonElement);

        phone.replace(" ", "");
        if (phone.includes("+45")) {
            phone = phone.replace("+45", "");
        }
        const response = await fetch(`${$BASE_URL}/api/auth/register`, {
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
            toastr.success(data.message);
            stopLoading(registerButtonElement);
            navigate("/aktiver-bruger", { replace: true });
        } else {
            toastr.error(data.message);
            stopLoading(registerButtonElement);
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
        <button type="submit" bind:this={registerButtonElement}>Opret</button>
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

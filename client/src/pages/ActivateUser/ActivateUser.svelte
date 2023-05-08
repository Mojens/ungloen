<script>
    document.title = "UngLøn | Aktiver din bruger";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import { useNavigate, useLocation } from "svelte-navigator";
    import toastr from "toastr";

    const navigate = useNavigate();
    const location = useLocation();

    let verification_code = "";
    let phone = "";

    async function verifyUser() {
        let buttonElement = document.getElementById("activate-user-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");

        const response = await fetch($BASE_URL + "/api/verify", {
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
            setTimeout(() => {
                buttonElement.removeAttribute("aria-busy");
                buttonElement.removeAttribute("class");
                toastr.success(data.message);
                const from =
                    ($location.state && $location.state.from) || "/log-ind";
                navigate(from, { replace: true });
            }, 1000);
        } else {
            toastr.error(data.message);
        }
    }
</script>

<main class="container">
    <h1 class="title down-m">Aktiver din bruger</h1>
    <p class="down-m">
        Indtast venligst din aktiveringskode du har modtaget på SMS.
    </p>
    <p class="p-end">
        Hvis du ikke kan finde din aktiveringskode, kan du få den tilsendt igen
        ved at klikke på linket <a href="/send-aktiveringskode"
            >Send aktiveringskode</a
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
        <button type="submit" id="activate-user-btn">Aktiver</button>
    </form>
    <div class="form-links">
        <a href="/log-ind">Er du allerede aktiveret?</a>
        <span id="form-link-divider">|</span>
        <a href="/opret-bruger">Opret en bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/glemt-adgangskode">Glemt adgangskode?</a>
        <span id="form-link-divider">|</span>
        <a href="/send-aktiveringskode">Send aktiveringskode</a>
    </div>
</main>

<style>
</style>

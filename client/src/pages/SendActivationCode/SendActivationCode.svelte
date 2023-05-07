<script>
import { BASE_URL } from "../../stores/globalsStore.js";
import toastr from "toastr";
import { useNavigate, useLocation } from "svelte-navigator";

const navigate = useNavigate();
const location = useLocation();

let email = "";

async function resendActivationCode(){
    const response = await fetch($BASE_URL + "/api/resend-verification", {
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
        setTimeout(() => {
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
    <h1 class="title-contact down-m">Send aktiveringskode</h1>
    <p class="down-m">
        Indtast venligst din Email og vi sender dig en ny aktiverings kode på SMS.
    </p>
    <p class="p-end">
        Hvis du fandt din aktiveringskode, behøver du ikke at anmode om en ny hvis det er inden for <b>24 Timer</b>.<br>
        Så kan du nemlig bare klikke på linket <a href="/aktiver-bruger">Aktiver bruger</a>.
    </p>
    <form on:submit|preventDefault={resendActivationCode}>
        <label for="email">Email</label>
        <input type="email" bind:value={email} id="email" name="email" placeholder="john_doe@emailprovider.dk" required>
        <small>Din aktiveringskode er gyldig i 24 timer efter du har modtaget den.</small>
        <button type="submit" class="btn btn-primary">Send aktiveringskode</button>
    </form>
    <div class="form-links">
        <a href="/log-ind">Er du allerede aktiveret?</a>
        <span id="form-link-divider">|</span>
        <a href="/opret-bruger">Opret en bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/glemt-adgangskode">Glemt adgangskode?</a>
        <span id="form-link-divider">|</span>
        <a href="/aktiver-bruger">Har du allerede en aktiveringskode?</a>

    </div>
</main>

<style>

</style>
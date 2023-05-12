<script>
    document.title = "UngLøn | Send aktiveringskode";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import toastr from "toastr";
    import { useNavigate, useLocation } from "svelte-navigator";
    import AuthLinks from "../../components/AuthLinks/AuthLinks.svelte";

    const navigate = useNavigate();

    let email = "";

    async function resendActivationCode() {
        let buttonElement = document.getElementById("send-activation-code-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");
        const response = await fetch($BASE_URL + "/api/auth/resend-verification", {
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
            setTimeout(() => {
                toastr.success(data.message);
                buttonElement.removeAttribute("aria-busy");
                buttonElement.removeAttribute("class");
                navigate("/aktiver-bruger", { replace: true });
            }, 1500);
        } else {
            toastr.error(data.message);
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
        }
    }
</script>

<main class="container">
    <h1 class="title down-m">Send aktiveringskode</h1>
    <p class="down-m">
        Indtast venligst din Email og vi sender dig en ny aktiverings kode på
        SMS.
    </p>
    <p class="p-end">
        Hvis du fandt din aktiveringskode, behøver du ikke at anmode om en ny
        hvis det er inden for <b>24 Timer</b>.<br />
        Så kan du nemlig bare klikke på linket
        <a href="/aktiver-bruger">Aktiver bruger</a>.
    </p>
    <form on:submit|preventDefault={resendActivationCode}>
        <label for="email">Email</label>
        <input
            type="email"
            bind:value={email}
            id="email"
            name="email"
            placeholder="john_doe@emailprovider.dk"
            required
        />
        <small
            >Din aktiveringskode er gyldig i 24 timer efter du har modtaget den.</small
        >
        <button type="submit" id="send-activation-code-btn"
            >Send aktiveringskode</button
        >
    </form>
    <AuthLinks path={location.pathname} />
</main>

<style>
</style>

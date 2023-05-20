<script>
    export let pageTitle;
    document.title = pageTitle;

    import { BASE_URL } from "../../stores/globalsStore.js";
    import { startLoading, stopLoading } from "../../util/loadingButton.js";
    import { useNavigate } from "svelte-navigator";
    import toastr from "toastr";
    import AuthLinks from "../../components/AuthLinks/AuthLinks.svelte";

    const navigate = useNavigate();

    let email = "";

    let resetPasswordButtonElement;

    async function resendActivationCode() {
        startLoading(resetPasswordButtonElement);
        
        const response = await fetch(
            `${$BASE_URL}/api/auth/resend-verification`,
            {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            stopLoading(resetPasswordButtonElement);
            navigate("/aktiver-bruger", { replace: true });
        } else {
            toastr.error(data.message);
            stopLoading(resetPasswordButtonElement);
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
        hvis den er mindre end <b>24 Timer</b> gammel.<br />
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
        <button type="submit" bind:this={resetPasswordButtonElement}
            >Send aktiveringskode</button
        >
    </form>
    <AuthLinks path={location.pathname} />
</main>

<style>
    p {
        font-size: small !important;
    }
</style>

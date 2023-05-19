<script>
    import { Link } from "svelte-navigator";
    export let path = "";
</script>

{#if path === "/send-aktiveringskode"}
    <div class="form-links">
        <Link to="/log-ind">Er du allerede aktiveret?</Link>
        <span id="form-link-divider">|</span>
        <Link to="/opret-bruger">Opret en bruger</Link>
        <span id="form-link-divider">|</span>
        <Link to="/glemt-adgangskode">Glemt adgangskode?</Link>
        <span id="form-link-divider">|</span>
        <Link to="/aktiver-bruger">Har du allerede en aktiveringskode?</Link>
    </div>
{:else if path === "/opret-bruger"}
    <div class="form-links">
        <Link to="/log-ind">Allerede oprettet?</Link>
        <span id="form-link-divider">|</span>
        <Link to="/glemt-adgangskode">Glemt adgangskode?</Link>
        <span id="form-link-divider">|</span>
        <Link to="/aktiver-bruger">Aktiver din bruger</Link>
        <span id="form-link-divider">|</span>
        <Link to="/send-aktiveringskode">Send aktiveringskode</Link>
    </div>
{:else if path === "/log-ind"}
    <div class="form-links">
        <Link to="/glemt-adgangskode">Glemt adgangskode?</Link>
        <span id="form-link-divider">|</span>
        <Link to="/opret-bruger">Opret en bruger</Link>
        <span id="form-link-divider">|</span>
        <Link to="/aktiver-bruger">Aktiver din bruger</Link>
        <span id="form-link-divider">|</span>
        <Link to="/send-aktiveringskode">Send aktiveringskode</Link>
    </div>
{:else if path === "/glemt-adgangskode"}
    <div class="form-links">
        <Link to="/log-ind">Allerede oprettet?</Link>
        <span id="form-link-divider">|</span>
        <Link to="/opret-bruger">Opret en bruger</Link>
        <span id="form-link-divider">|</span>
        <Link to="/aktiver-bruger">Aktiver din bruger</Link>
        <span id="form-link-divider">|</span>
        <Link to="/send-aktiveringskode">Send aktiveringskode</Link>
    </div>
{:else if path === "/aktiver-bruger"}
    <div class="form-links">
        <Link to="/log-ind">Er du allerede aktiveret?</Link>
        <span id="form-link-divider">|</span>
        <Link to="/opret-bruger">Opret en bruger</Link>
        <span id="form-link-divider">|</span>
        <Link to="/glemt-adgangskode">Glemt adgangskode?</Link>
        <span id="form-link-divider">|</span>
        <Link to="/send-aktiveringskode">Send aktiveringskode</Link>
    </div>
{/if}

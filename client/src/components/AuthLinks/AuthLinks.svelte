<script>
    export let path = "";
</script>

{#if path === "/send-aktiveringskode"}
    <div class="form-links">
        <a href="/log-ind">Er du allerede aktiveret?</a>
        <span id="form-link-divider">|</span>
        <a href="/opret-bruger">Opret en bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/glemt-adgangskode">Glemt adgangskode?</a>
        <span id="form-link-divider">|</span>
        <a href="/aktiver-bruger">Har du allerede en aktiveringskode?</a>
    </div>
{:else if path === "/opret-bruger"}
    <div class="form-links">
        <a href="/log-ind">Allerede oprettet?</a>
        <span id="form-link-divider">|</span>
        <a href="/glemt-adgangskode">Glemt adgangskode?</a>
        <span id="form-link-divider">|</span>
        <a href="/aktiver-bruger">Aktiver din bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/send-aktiveringskode">Send aktiveringskode</a>
    </div>
{:else if path === "/log-ind"}
    <div class="form-links">
        <a href="/glemt-adgangskode">Glemt adgangskode?</a>
        <span id="form-link-divider">|</span>
        <a href="/opret-bruger">Opret en bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/aktiver-bruger">Aktiver din bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/send-aktiveringskode">Send aktiveringskode</a>
    </div>
{:else if path === "/glemt-adgangskode"}
    <div class="form-links">
        <a href="/log-ind">Allerede oprettet?</a>
        <span id="form-link-divider">|</span>
        <a href="/opret-bruger">Opret en bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/aktiver-bruger">Aktiver din bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/send-aktiveringskode">Send aktiveringskode</a>
    </div>
{:else if path === "/aktiver-bruger"}
    <div class="form-links">
        <a href="/log-ind">Er du allerede aktiveret?</a>
        <span id="form-link-divider">|</span>
        <a href="/opret-bruger">Opret en bruger</a>
        <span id="form-link-divider">|</span>
        <a href="/glemt-adgangskode">Glemt adgangskode?</a>
        <span id="form-link-divider">|</span>
        <a href="/send-aktiveringskode">Send aktiveringskode</a>
    </div>
{/if}

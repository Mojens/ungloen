<script>
    let email = "";
    async function handleContact() {
        console.log("handleContact", email);
    }
</script>

<footer class="footer-top-m">
    <hr />
    <div class="grid">
        <div class="center">
            <a href="/">
                <h2>
                    <span>💰</span>
                    <span>ungløn.dk</span>
                </h2>
            </a>
        </div>
        <div class="center">
            <ul class="footer-links">
                <li><a href="/om-os">Om os</a></li>
                <li><a href="/kontakt">Kontakt</a></li>
                <li><a href="/log-ind">Log ind</a></li>
                <li><a href="/opret-bruger">Opret bruger</a></li>
            </ul>
        </div>
        <div class="center">
            <form on:submit|preventDefault={handleContact}>
                <input
                    type="text"
                    id="email"
                    name="email"
                    bind:value={email}
                    placeholder="Din email.."
                />
                <button type="submit">Kontakt os</button>
            </form>
        </div>
    </div>
    <hr />
    <div class="grid">
        <div class="center">
            <p class="copyright">
                &copy; 2023 Alle rettigheder forbeholdes af ungløn.dk
            </p>
        </div>
        <div />
        <div class="center">
            <a href=""><i class="fa fa-facebook" /></a>
            <a href=""><i class="fa fa-instagram" /></a>
            <a href=""><i class="fa fa-twitter" /></a>
            <a href="https://github.com/Mojens/ungloen" target="_blank"
                ><i class="fa fa-github" /></a
            >
        </div>
    </div>
</footer>

<style>
    .footer-top-m {
        padding-top: 2rem;
    }
    .center a {
        margin: 0 10px;
    }
    .footer-links {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .footer-links li {
        margin: 10px;
        text-align: center;
        flex-basis: 50%;
        list-style: none;
    }

    @media (min-width: 768px) {
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
        .footer-links li {
            flex-basis: auto;
            margin: 0;
        }
    }
</style>

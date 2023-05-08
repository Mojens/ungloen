<script>
    import toastr from "toastr";
    import { BASE_URL } from "../../stores/globalsStore.js";
    let email = "";
    async function handleContact() {
        let buttonElement = document.getElementById("footer-contact-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");
        const response = await fetch($BASE_URL + "/api/footer/contact", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.status === 200) {
            setTimeout(() => {
                buttonElement.removeAttribute("aria-busy");
                buttonElement.removeAttribute("class");
                toastr.success(data.message);
                email = "";
            }, 1000);
        } else {
            toastr.error(data.message);
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
        }
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
                <li><a href="/tjenester">Tjenester</a></li>
                <li><a href="/om-os">Om os</a></li>
                <li><a href="/kontakt">Kontakt</a></li>
                <li><a href="/log-ind">Log ind</a></li>
            </ul>
        </div>
        <div class="center">
            <form on:submit|preventDefault={handleContact}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    bind:value={email}
                    placeholder="Din email.."
                />
                <button type="submit" id="footer-contact-btn">Kontakt os</button
                >
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
            <a href="/#"><i class="fa fa-facebook" /></a>
            <a href="/#"><i class="fa fa-instagram" /></a>
            <a href="/#"><i class="fa fa-twitter" /></a>
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

<script>
    export let pageTitle;
    document.title = pageTitle;
    
    import { BASE_URL } from "../../stores/globalsStore.js";
    import { startLoading, stopLoading } from "../../util/loadingButton.js";
    import toastr from "toastr";

    let name = "";
    let email = "";
    let title = "";
    let message = "";

    let contactButtonElement;

    async function handleContact() {
        startLoading(contactButtonElement);

        const response = await fetch(`${$BASE_URL}/api/contact}`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                title,
                message,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            name = "";
            email = "";
            title = "";
            message = "";
            stopLoading(contactButtonElement);
        } else {
            toastr.error(data.message);
            stopLoading(contactButtonElement);
        }
    }
</script>

<main class="container">
    <h1 class="title-contact">Kontakt os</h1>
    <div class="grid gap-md border-raidus down-m">
        <div class="col-6">
            <h2>Send os en besked</h2>
            <form on:submit|preventDefault={handleContact}>
                <label for="name">Navn</label>
                <input
                    type="text"
                    bind:value={name}
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                />

                <label for="email">Email</label>
                <input
                    type="email"
                    bind:value={email}
                    id="email"
                    name="email"
                    placeholder="john_doe@emailprovider.dk"
                    required
                />
                <label for="title">Emne</label>
                <input
                    type="text"
                    bind:value={title}
                    id="title"
                    name="text"
                    placeholder="Fed hjemmeside!"
                    required
                />

                <label for="message">Besked</label>
                <textarea
                    id="message"
                    bind:value={message}
                    name="message"
                    placeholder="Skriv din besked her..."
                    required
                />

                <button type="submit" bind:this={contactButtonElement}>Kontakt</button>
            </form>
        </div>
        <div class="col-62 left-m">
            <h2>Kontakt informationer</h2>
            <p>Guldbergsgade 29n</p>
            <p>2200, København N</p>
            <h3>Telefon</h3>
            <a href="tel:+4561656854"><p>+45 61 65 68 54</p></a>
            <h3>Email</h3>
            <a href="mailto:moha135h@stud.kea.dk"><p>Moha135h@stud.kea.dk</p></a
            >
        </div>
    </div>
</main>

<style>
</style>

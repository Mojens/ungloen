<script>
    document.title = "UngLøn | Profil";
    import { onMount } from "svelte";
    import toastr from "toastr";
    import { BASE_URL, user } from "../../../stores/globalsStore.js";
    let first_name = "";
    let last_name = "";
    let email = "";
    let phone = "";

    async function getUser() {
        const response = await fetch($BASE_URL + "/api/private/users/" + $user.id, {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            first_name = data.user.first_name;
            last_name = data.user.last_name;
            email = data.user.email;
            phone = data.user.phone;
        } else {
            toastr.error(data.message);
        }
    }
    async function handleUpdateProfile() {
        const buttonElement = document.getElementById("update-profile-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");
        const response = await fetch($BASE_URL + "/api/private/users/" + $user.id, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name,
                last_name,
                email,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            setTimeout(() => {
                buttonElement.removeAttribute("aria-busy");
                buttonElement.removeAttribute("class");
                toastr.success(data.message);
                user.set(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                getUser();
            }, 1000);
        } else {
            toastr.error(data.message);
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
        }
    }
    async function handleResetPassword() {
        let buttonElement = document.getElementById("reset-password-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");
        const response = await fetch($BASE_URL + "/api/auth/forgot-password", {
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
                buttonElement.removeAttribute("aria-busy");
                buttonElement.removeAttribute("class");
                toastr.success(data.message);
            }, 1000);
        } else {
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
            toastr.error(data.message);
        }
    }
    onMount(async () => {
        await getUser();
    });
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Profil</h1>
        <h3>Du kan opdater dine bruger informationer her.</h3>
    </hgroup>
    <nav aria-label="breadcrumb">
        <ul>
            <li><a href="/profil/personlig">Person oplysninger</a></li>
            <li>Profil</li>
        </ul>
    </nav>
    <form>
        <label for="first_name">Fornavn</label>
        <input
            type="text"
            minlength="1"
            id="first_name"
            name="first_name"
            bind:value={first_name}
            required
        />
        <label for="last_name">Efternavn</label>
        <input
            type="text"
            minlength="1"
            id="last_name"
            name="last_name"
            bind:value={last_name}
            required
        />
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            bind:value={email}
            required
        />
        <label for="phone">Telefonnummer</label>
        <input
            type="tel"
            minlength="8"
            maxlength="8"
            id="phone"
            name="phone"
            bind:value={phone}
            required
        />
        <button
            type="button"
            id="update-profile-btn"
            on:click={handleUpdateProfile}>Opdater profil</button
        >
    </form>
    <button type="button" id="reset-password-btn" on:click={handleResetPassword}
        >Nulstil adgangskode</button
    >
</main>

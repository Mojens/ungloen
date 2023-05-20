<script>
    export let pageTitle;
    document.title = pageTitle;

    import { onMount } from "svelte";
    import { startLoading, stopLoading } from "../../../util/loadingButton.js";
    import { BASE_URL, user } from "../../../stores/globalsStore.js";
    import { Link } from "svelte-navigator";
    import toastr from "toastr";

    let first_name = "";
    let last_name = "";
    let email = "";
    let phone = "";

    let resetPasswordButtonElement;
    let updateProfileButtonElement;

    async function getUser() {
        const response = await fetch(
            `${$BASE_URL}/api/private/users/${$user.id}`,
            {
                credentials: "include",
            }
        );
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

    async function updateUser() {
        startLoading(updateProfileButtonElement);
        
        const response = await fetch(
            `${$BASE_URL}/api/private/users/${$user.id}`,
            {
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
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            user.set(data.user);
            await getUser();
            stopLoading(updateProfileButtonElement);
        } else {
            toastr.error(data.message);
            stopLoading(updateProfileButtonElement);
        }
    }

    async function handleResetPassword() {
        startLoading(resetPasswordButtonElement);

        const response = await fetch(`${$BASE_URL}/api/auth/forgot-password`, {
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
            stopLoading(resetPasswordButtonElement);
        } else {
            toastr.error(data.message);
            stopLoading(resetPasswordButtonElement);
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
            <li><a>Profil</a></li>
            <li>
                <Link to="/profil/personlig">Person oplysninger</Link>
            </li>
        </ul>
    </nav>
    <form on:submit|preventDefault={updateUser}>
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
        <button type="submit" bind:this={updateProfileButtonElement}
            >Opdater profil</button
        >
    </form>
    <button type="button" bind:this={resetPasswordButtonElement} on:click={handleResetPassword}
        ><i class="fa fa-lock right-m" />Nulstil adgangskode</button
    >
</main>
<style>
    li a {
        text-decoration: none;
        color: black;
    }
</style>
<script>
    export let pageTitle;
    document.title = pageTitle;

    import { onMount } from "svelte";
    import { BASE_URL, user } from "../../../stores/globalsStore.js";
    import toastr from "toastr";
    import { Link } from "svelte-navigator";

    let zip_code = "";
    let city = "";
    let adress = "";
    let tax_rate = "";
    let monthly_deduction = "";

    async function getPersonalData() {
        const response = await fetch(
            `${$BASE_URL}/api/private/users/tax/data`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            if (data.taxData.zip_code !== 0) {
                zip_code = data.taxData.zip_code;
            }
            if (data.taxData.tax_rate !== 0) {
                tax_rate = data.taxData.tax_rate;
            }
            if (data.taxData.monthly_deduction !== 0) {
                monthly_deduction = data.taxData.monthly_deduction;
            }
            city = data.taxData.city;
            adress = data.taxData.address;
        } else {
            toastr.error(data.message);
        }
    }

    async function updatePersonalData() {
        let buttonElement = document.getElementById("update-personal-data-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");

        const response = await fetch(
            `${$BASE_URL}/api/private/tax/data/users/${$user.id}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    zip_code: zip_code,
                    city: city,
                    address: adress,
                    tax_rate: tax_rate,
                    monthly_deduction: monthly_deduction,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
            toastr.success(data.message);
            await getPersonalData();
        } else {
            toastr.error(data.message);
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
        }
    }

    onMount(async () => {
        await getPersonalData();
    });
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Dine personlige oplysninger</h1>
        <h3>Du kan opdater dine personlige oplysninger her.</h3>
    </hgroup>
    <nav aria-label="breadcrumb">
        <ul>
            <li><Link to="/profil">Profil</Link></li>
            <li>Person oplysninger</li>
        </ul>
    </nav>
    <form on:submit|preventDefault={updatePersonalData}>
        <div class="grid">
            <label for="zip_code">
                Postnummer
                <input
                    type="number"
                    id="zip_code"
                    name="zip_code"
                    placeholder="4000"
                    bind:value={zip_code}
                    required
                />
            </label>

            <label for="city">
                By
                <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Roskilde"
                    bind:value={city}
                    required
                />
            </label>
        </div>
        <label for="adress">Adresse</label>
        <input
            type="text"
            id="adress"
            name="adress"
            placeholder="Skovbogade 3"
            bind:value={adress}
            required
        />
        <div class="grid">
            <label for="tax_rate">
                Trækprocent
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                    class="tooltip-large"
                    data-tooltip="
                    Trækprocenten afhænger bl. a. af, hvor høj din indkomst er,
                     hvilken kommune, du bor i og om du er medlem af folkekirken.
                     I 2023 spænder trækprocenten i Danmark fra 37% til 52,07%."
                    ><i class="fa fa-question-circle" /></a
                >
                <input
                    type="number"
                    min="30"
                    max="99"
                    step="0.01"
                    id="tax_rate"
                    class="tax_rate"
                    name="tax_rate"
                    placeholder="52"
                    bind:value={tax_rate}
                    required
                />
            </label>

            <label for="monthly_deduction">
                Månedsfradrag
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                    class="tooltip-large"
                    data-tooltip="
                    Personfradraget er i år 2022 46.600 kr. pr. år for personer på 18 år eller ældre. For personer under 18 år er beløbet 37.300 kr."
                    ><i class="fa fa-question-circle" /></a
                >
                <input
                    type="number"
                    id="monthly_deduction"
                    name="monthly_deduction"
                    placeholder="5000"
                    bind:value={monthly_deduction}
                    required
                />
            </label>
        </div>

        <small>Vi vil aldrig dele dine oplysninger med andre.</small>

        <button type="submit" id="update-personal-data-btn"
            >Gem oplysninger</button
        >
    </form>
</main>

<style>
    .tooltip-large::before {
        width: 20vw;
        overflow: visible;
        white-space: normal;
    }
</style>

<script>
    document.title = "UngLøn | Personlige oplysninger";
    import { onMount } from "svelte";
    import { BASE_URL, user } from "../../../stores/globalsStore.js";
    import toastr from "toastr";

    let zip_code = "";
    let city = "";
    let adress = "";
    let deduction_rate = "";
    let monthly_deduction = "";

    async function getPersonalData() {
        const response = await fetch(
            $BASE_URL + "/api/tax/data/users/" + $user.id,
            {
                method: "GET",
                credentials: "include",
            }
        );
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            if (data.userTaxData.zip_code !== 0) {
                zip_code = data.userTaxData.zip_code;
            }
            if (data.userTaxData.deduction_rate !== 0) {
                deduction_rate = data.userTaxData.deduction_rate;
            }
            if (data.userTaxData.monthly_deduction !== 0) {
                monthly_deduction = data.userTaxData.monthly_deduction;
            }
            city = data.userTaxData.city;
            adress = data.userTaxData.address;
        } else {
            toastr.error(data.message);
        }
    }

    async function handleUpdatePersonalData() {
        const newData = {
            zip_code: zip_code,
            city: city,
            address: adress,
            deduction_rate: deduction_rate,
            monthly_deduction: monthly_deduction,
        };
        console.log("NEWDATA",newData)
        const response = await fetch(
            $BASE_URL + "/api/tax/data/users/" + $user.id,
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
                    deduction_rate: deduction_rate,
                    monthly_deduction: monthly_deduction,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            getPersonalData();
        } else {
            toastr.error(data.message);
        }
    }
    onMount(() => {
        getPersonalData();
    });
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Dine personlige oplysninger</h1>
        <h3>Du kan opdater dine personlige oplysninger her.</h3>
    </hgroup>
    <nav aria-label="breadcrumb">
        <ul>
            <li><a href="/profil">Profil</a></li>
            <li>Person oplysninger</li>
        </ul>
    </nav>
    <form on:submit|preventDefault={handleUpdatePersonalData}>
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
            <label for="deduction_rate">
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
                    id="deduction_rate"
                    class="deduction_rate"
                    name="deduction_rate"
                    placeholder="52"
                    bind:value={deduction_rate}
                    required
                />
            </label>

            <label for="monthly_deduction">
                Månedsfradrag
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                    class="tooltip-large"
                    data-tooltip="
                Dette fradrag, er et fradrag som alle personer kan få. &#10;
                 Personfradraget fordeles ud hen over året, og bliver trukket som et månedsfradrag fra ens løn,
                  inden man betaler A-skat. Personfradraget i 2020 er på 46.500 kr. per."
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

        <button type="submit">Gem oplysninger</button>
    </form>
</main>

<style>
    .tooltip-large::before {
        width: 20vw;
        overflow: visible;
        white-space: normal;
    }
</style>

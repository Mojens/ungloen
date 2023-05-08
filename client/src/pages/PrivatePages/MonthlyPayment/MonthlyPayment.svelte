<script>
    document.title = "UngLøn | Månedsløn";
    import { BASE_URL, incomeTypes } from "../../../stores/globalsStore.js";
    import { onMount } from "svelte";
    import toastr from "toastr";

    let showForm = false;
    let userPersonalData = {};
    let incomeType = "";
    let payoutTime = "";
    let monthlyIncome = 0;
    let headOrBiCard = "";

    function toogleForm() {
        if (incomeType !== "") {
            showForm = true;
        } else {
            showForm = false;
        }
    }

    async function getTaxData() {
        const response = await fetch($BASE_URL + "/api/tax/data", {
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            userPersonalData = data.taxData;
        } else {
            toastr.error(data.message);
        }
    }

    async function calculateMonthlyPayout() {
        console.log("Trækprocent", userPersonalData.tax_rate);
        console.log("Fradrag", userPersonalData.monthly_deduction);
        console.log("incomeType: " + incomeType);
        console.log("payoutTime: " + payoutTime);
        console.log("monthlyIncome: " + monthlyIncome);
        console.log("headOrBiCard: " + headOrBiCard);
    }

    onMount(() => {
        getTaxData();
    });
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Beregn månedsløn</h1>
        <h3>
            Her kan du regne ud hvad du får udbetalt, før du får din lønseddel.
        </h3>
    </hgroup>
    <div id="choose-income-type">
        <label for="incomeType">Indkomsttype</label>
        <select
            id="select-incometype"
            bind:value={incomeType}
            on:change={toogleForm}
            required
        >
            <option value="" disabled selected>Vælg en Indkomsttype</option>
            {#each $incomeTypes as incomeType}
                <option value={incomeType}>{incomeType}</option>
            {/each}
        </select>
    </div>
    {#if showForm !== false}
        <h3>
            Udfyld formen med din indkomst, og se hvad du ca. får udbetalt før
            skat.
        </h3>
        <form id="løn-form" on:submit|preventDefault={calculateMonthlyPayout}>
            <hr />
            <div class="grid">
                <div>
                    <p>
                        Bruger du dit <b>hovedkort</b> eller <b>bikort</b> på indkomsten?
                    </p>
                </div>
                <fieldset>
                    <label for="biCard">
                        <input
                            type="radio"
                            id="biCard"
                            name="biCard"
                            value="biCard"
                            bind:group={headOrBiCard}
                            checked
                        />
                        Bikort
                    </label>
                    <label for="headCard">
                        <input
                            type="radio"
                            id="headCard"
                            name="headCard"
                            value="headCard"
                            bind:group={headOrBiCard}
                        />
                        Hovedkort
                    </label>
                </fieldset>
            </div>
            <hr />
            {#if incomeType === "Løn"}
                <div class="grid">
                    <div>
                        <p>Hvad er din lønperiode?</p>
                    </div>
                    <fieldset>
                        <label for="every2week">
                            <input
                                type="radio"
                                id="every2week"
                                name="every2week"
                                value="every2week"
                                bind:group={payoutTime}
                            />
                            Hver anden uge
                        </label>
                        <label for="monthly">
                            <input
                                type="radio"
                                id="monthly"
                                name="monthly"
                                value="monthly"
                                bind:group={payoutTime}
                            />
                            pr. måned
                        </label>
                    </fieldset>
                </div>
                <hr />
            {/if}
            <div class="grid">
                <div>
                    <p>
                        <!-- svelte-ignore a11y-missing-attribute -->
                        Indkomst pr. måned
                        <a
                            class="tooltip-large"
                            data-tooltip="
                    Du skal bruge den løn, der på lønsedler normalt betegnes som A-indkomst.
                     Det er den løn, som de fleste opfatter som deres bruttoløn – det vil sige lønnen uden en eventuel arbejdsgiveradministreret pension."
                            ><i class="fa fa-question-circle" /></a
                        >
                    </p>
                </div>
                <label for="monthlyIncome">
                    <input
                        type="number"
                        id="monthlyIncome"
                        name="monthlyIncome"
                        placeholder="25000"
                        bind:value={monthlyIncome}
                        step="0.01"
                        required
                    />
                </label>
            </div>
            <button type="submit">Beregn</button>
        </form>
    {/if}
</main>

<style>
    .tooltip-large::before {
        width: 20vw;
        overflow: visible;
        white-space: normal;
    }
</style>

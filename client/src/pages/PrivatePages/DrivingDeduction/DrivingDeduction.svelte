<script>
    document.title = "UngLøn | Kørselsfradrag";
    import { BASE_URL } from "../../../stores/globalsStore.js";
    import { onMount } from "svelte";
    import toastr from "toastr";

    let destination = "";
    let origin = "";
    let distance = "";
    let predictions = [];

    let startDate = new Date().getFullYear() + "-01-01";
    let endDate = new Date().getFullYear() + "-12-31";
    let averageWorkDays = 0;
    let workDaysInTransport = "";

    let payForBridge = false;
    let isStorebaeltsbroen = false;
    let isOeresundsbroen = false;
    let typeOfTransport = "";
    let payBothWays = false;

    function onChangeTest() {
        console.log("destination", destination);
        console.log("origin", origin);
        console.log("distance", distance);
        console.log("startDate", startDate);
        console.log("endDate", endDate);
        console.log("averageWorkDays", averageWorkDays);
        console.log("workDaysInTransport", workDaysInTransport);
        console.log("payForBridge", payForBridge);
        console.log("storebæltsbroen", isStorebaeltsbroen);
        console.log("øresundsbroen", isOeresundsbroen);
        console.log("typeOfTransport", typeOfTransport);
        console.log("payBothWays", payBothWays);
    }

    function getWorkDays() {
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                startDate = new Date().getFullYear() + "-01-01";
                endDate = new Date().getFullYear() + "-12-31";
            }
        }
        let start = new Date(startDate);
        let end = new Date(endDate);
        let workDays = 0;
        let day = new Date(start.getTime());
        while (day <= end) {
            if (day.getDay() >= 1 && day.getDay() <= 5) {
                workDays++;
            }
            day.setDate(day.getDate() + 1);
        }
        averageWorkDays = workDays;
    }

    async function getDistance() {
        let buttonElement = document.getElementById("address-distance-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary");
        const response = await fetch($BASE_URL + "/api/googlemaps/distance", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                origin,
                destination,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            setTimeout(() => {
                distance = data.distance;
                toastr.success("Afstand fundet");
                buttonElement.removeAttribute("aria-busy");
                buttonElement.removeAttribute("class");
                setTimeout(() => {
                    document
                        .getElementById("driving-deduction-form")
                        .scrollIntoView({
                            behavior: "smooth",
                        });
                }, 100);
            }, 1000);
        } else {
            buttonElement.removeAttribute("aria-busy");
            buttonElement.removeAttribute("class");
            toastr.error(data.message);
        }
    }

    async function getPersonalData() {
        const response = await fetch($BASE_URL + "/api/tax/data", {
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            origin = `${data.taxData.address}, ${data.taxData.zip_code} ${data.taxData.city}`;
        } else {
            toastr.error(data.message);
        }
    }

    async function autocomplete() {
        if (destination.length < 2) {
            predictions = [];
            return;
        }
        const response = await fetch(
            $BASE_URL + "/api/googlemaps/autocomplete?input=" + destination,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            predictions = data.predictions;
        } else {
            predictions = [];
            toastr.error(data.message);
        }
    }
    onMount(() => {
        getPersonalData();
        getWorkDays();
    });
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Bereng kørselsfradrag</h1>
        <h3>Her kan du regne din kørselsfradrag ud.</h3>
    </hgroup>
    <form class="address-form" on:submit|preventDefault={getDistance}>
        <hgroup>
            <h2>Arbejdsadresse</h2>
            <h3>
                hvis du ikke kender den præcise kilometer afstand fra dit hjem
                til din arbejdsplads, kan du søge efter din arbejdsplads
                addresse herunder og få den præcise afstand.
            </h3>
        </hgroup>
        <label for="destination">Beregn afstand </label>
        <input
            class="down-m"
            on:input={() => setTimeout(() => autocomplete(), 100)}
            bind:value={destination}
            type="text"
            name="destination"
            id="destination"
            placeholder="Guldbergsgade 29N, 2200 København N"
            required
        />
        {#if predictions.length > 0}
            <div class="autocom-box">
                <ul class="suggestions-ul">
                    {#each predictions as prediction}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <li
                            class="suggestion-item"
                            on:click={() => {
                                destination = prediction.description;
                                predictions = [];
                            }}
                        >
                            {prediction.description}
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
        <button id="address-distance-btn" type="submit">
            Beregn afstand
        </button>
    </form>
    <form id="driving-deduction-form">
        <hgroup>
            <h2>Kørselsfradrag</h2>
            <h3>Udfyld felterne forneden og se din kørselsfradrag</h3>
        </hgroup>
        <label for="workDistance"
            >Kilometer til arbejde
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
                class="tooltip-large"
                data-tooltip="
                Du skal bruge den reelle kørselsafstand mellem din officielle adresse (folkeregister-adresse) og din arbejdsplads. Det behøver ikke være den korteste rute.
                Hvis du kører i tog eller bus, er det stadig normalafstanden i bil, der gælder.
                Hvis du har afstikkere på din rute (henter kollegaer eller henter/bringer børn), skal du ikke regne de ekstra kilometer med."
                ><i class="fa fa-question-circle" /></a
            >
        </label>
        <input
            class="down-m"
            type="number"
            name="workDistance"
            id="workDistance"
            step="0.01"
            placeholder="Kilometer til arbejde"
            bind:value={distance}
            required
        />
        <div class="grid">
            <label for="startDate">
                Startdato
                <input
                    on:change={getWorkDays}
                    bind:value={startDate}
                    min="{new Date().getFullYear()}-01-01"
                    max="{new Date().getFullYear()}-12-31"
                    class="down-m input-date"
                    type="date"
                    name="startDate"
                    id="startDate"
                    required
                />
            </label>
            <label for="endDate">
                Slutdato
                <input
                    on:change={getWorkDays}
                    bind:value={endDate}
                    min={startDate}
                    max="{new Date().getFullYear()}-12-31"
                    class="down-m input-date"
                    type="date"
                    name="endDate"
                    id="endDate"
                    required
                />
            </label>
        </div>
        <div class="grid">
            <label for="averageWorkDays">
                Arbejdsdage i perioden i gennemsnit
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                    class="tooltip-large"
                    data-tooltip="
                Antallet af arbejdsdage er beregnet efter den periode, du har valgt.
                Der er i gennemsnit 260 arbejdsdage på et år."
                    ><i class="fa fa-question-circle" /></a
                >
                <input
                    bind:value={averageWorkDays}
                    class="down-m input-disabled"
                    type="text"
                    name="averageWorkDays"
                    id="averageWorkDays"
                    readonly
                />
            </label>
            <label for="workDaysInTransport">
                Mine arbejdsdage med transport i perioden
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                    class="tooltip-large"
                    data-tooltip="
                Du får kun fradrag for de arbejdsdage i perioden, hvor du reelt er kørt til og fra arbejde.
                Du kan altså ikke få fradrag for fx fridage, hjemmearbejdsdage, kursusdage, sygedage, orlov,
                barns sygedage eller andre dage, hvor du ikke har haft transport."
                    ><i class="fa fa-question-circle" /></a
                >
                <input
                    class="down-m"
                    bind:value={workDaysInTransport}
                    max={averageWorkDays}
                    type="number"
                    name="workDaysInTransport"
                    id="workDaysInTransport"
                    placeholder="Skriv antal dage"
                    required
                />
            </label>
        </div>
        <div class="inline-block">
            <fieldset>
                <legend
                    >Kører du over en betalingsbro?
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a
                        class="tooltip-large"
                        data-tooltip="
                Du kan få et ekstra brofradrag, hvis du kører over Storebæltsbroen eller Øresundsbroen. Bemærk, at ved samkørsel er det kun én i bilen, der kan få det ekstra brofradrag."
                        ><i class="fa fa-question-circle" /></a
                    >
                </legend>
                <label for="payForBridgeTrue" class="inline-block right-m">
                    <input
                        bind:group={payForBridge}
                        type="radio"
                        id="payForBridgeTrue"
                        name="payForBridgeTrue"
                        value={true}
                    />
                    ja
                </label>
                <label for="payForBridgeFalse">
                    <input
                        bind:group={payForBridge}
                        type="radio"
                        id="payForBridgeFalse"
                        name="payForBridgeFalse"
                        value={false}
                        checked
                    />
                    nej
                </label>
            </fieldset>
            <hr />
            {#if payForBridge === true}
                <fieldset>
                    <legend> Vælg betalingsbro </legend>
                    <label for="storebaeltsbroen">
                        Storebæltsbroen
                        <input
                            type="checkbox"
                            bind:checked={isStorebaeltsbroen}
                            on:change={onChangeTest}
                            id="storebaeltsbroen"
                            name="storebaeltsbroen"
                        />
                    </label>
                    <label for="oeresundsbro">
                        Øresundsbroen
                        <input
                            type="checkbox"
                            bind:checked={isOeresundsbroen}
                            on:change={onChangeTest}
                            id="oeresundsbro"
                            name="oeresundsbro"
                        />
                    </label>
                </fieldset>
                <hr />
                {#if isStorebaeltsbroen || isOeresundsbroen}
                    <fieldset class="inline-block">
                        <legend>Hvilket transportmiddel betaler du for?</legend>
                        <label for="Bil" class="inline-block right-m">
                            <input
                                bind:group={typeOfTransport}
                                on:change={onChangeTest}
                                type="radio"
                                id="Bil"
                                name="Bil"
                                value="Bil"
                            />
                            Bil
                        </label>
                        <label for="Motorcykel" class="inline-block">
                            <input
                                bind:group={typeOfTransport}
                                on:change={onChangeTest}
                                type="radio"
                                id="Motorcykel"
                                name="Motorcykel"
                                value="Motorcykel"
                                checked
                            />
                            Motorcykel
                        </label>
                        <label
                            for="Tog/Offentlig transport"
                            class="inline-block"
                        >
                            <input
                                bind:group={typeOfTransport}
                                on:change={onChangeTest}
                                type="radio"
                                id="Tog/Offentlig transport"
                                name="Tog/Offentlig transport"
                                value="Tog/Offentlig transport"
                                checked
                            />
                            Tog/Offentlig transport
                        </label>
                    </fieldset>
                    <hr />
                    <fieldset>
                        <legend>Betaler du begge veje?</legend>
                        <label
                            for="payBothWaysTrue"
                            class="inline-block right-m"
                        >
                            <input
                                bind:group={payBothWays}
                                on:change={onChangeTest}
                                type="radio"
                                id="payBothWaysTrue"
                                name="payBothWaysTrue"
                                value={true}
                            />
                            Ja
                        </label>
                        <label for="payBothWaysFalse" class="inline-block">
                            <input
                                bind:group={payBothWays}
                                on:change={onChangeTest}
                                type="radio"
                                id="payBothWaysFalse"
                                name="payBothWaysFalse"
                                value={false}
                                checked
                            />
                            Nej
                        </label>
                    </fieldset>
                {/if}
            {/if}
        </div>
    </form>
</main>

<style>
    .address-form {
        position: relative;
    }
    .autocom-box {
        position: absolute;
        left: 0;
        width: 100%;
        background-color: #fff;
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
        padding: 8px;
        opacity: 1;
        border: 1px solid #fff;
        pointer-events: auto;
    }
    @media (prefers-color-scheme: dark) {
        .autocom-box {
            position: absolute;
            left: 0;
            width: 100%;
            background-color: #11191f;
            box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 1;
            padding: 8px;
            opacity: 1;
            border: 1px solid #11191f;
            pointer-events: auto;
        }
        .suggestion-item:hover,
        .suggestion-item:focus {
            background-color: #16212a;
        }
    }

    .suggestions-ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .suggestion-item {
        padding: 6px;
        cursor: pointer;
        list-style: none;
        color: hsl(195, 85%, 41%);
    }
    @media (prefers-color-scheme: light) {
        .suggestion-item:hover,
        .suggestion-item:focus {
            background-color: #f2f2f2;
        }
    }

    .suggestion-item:last-child {
        border-bottom: none;
    }
    legend {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
</style>

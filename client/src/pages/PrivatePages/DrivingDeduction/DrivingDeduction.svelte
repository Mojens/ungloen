<script>
    document.title = "UngLøn | Kørselsfradrag";
    import { BASE_URL } from "../../../stores/globalsStore.js";
    import toastr from "toastr";

    let workAddress = "";
    let homeAddress = "";
    let predictions = [];


    async function getUserData(){
        
    }

    async function autocomplete() {
        if (workAddress.length < 2) {
            predictions = [];
            return;
        }
        const response = await fetch(
            $BASE_URL + "/api/googlemaps/autocomplete?input=" + workAddress,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            predictions = data.predictions;
            console.log(predictions);
        } else {
            predictions = [];
            toastr.error(data.message);
        }
    }
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Bereng kørselsfradrag</h1>
        <h3>Her kan du regne din kørselsfradrag ud.</h3>
    </hgroup>
    <form>
        <label for="workAddress">Arbejdsadresse </label>
        <input
            class="down-m"
            on:input={() => setTimeout(() => autocomplete(), 100)}
            bind:value={workAddress}
            type="text"
            name="workAddress"
            id="workAddress"
            placeholder="Arbejdsadresse"
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
                                workAddress = prediction.description;
                                predictions = [];
                            }}
                        >
                            {prediction.description}
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
        <label for="workDistance">Kilometer til arbejde </label>
        <input
            class="down-m"
            type="number"
            name="workDistance"
            id="workDistance"
            placeholder="Kilometer til arbejde"
            required
        />
    </form>
</main>

<style>
    form {
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
</style>

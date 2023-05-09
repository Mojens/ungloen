<script>
    document.title = "UngLøn | Feriepenge";
    import { BASE_URL } from "../../../stores/globalsStore.js";
    import toastr from "toastr";

    let holidayData = {};
    let monthlyIncome = 0;

    function formatNumber(number) {
        const formattedNumber = number.toLocaleString("da-DK");
        return formattedNumber;
    }

    async function calculateHolidayPayment() {
        let buttonElement = document.getElementById("calculate-holiday");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "secondary w-25");
        const response = await fetch($BASE_URL + "/api/tax/holiday-payment", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                monthlyIncome,
            }),
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            setTimeout(() => {
                holidayData = data.holidayPaymentData;
                buttonElement.removeAttribute("aria-busy");
                buttonElement.setAttribute("class", "w-25");
                setTimeout(() => {
                    document
                        .getElementById("vacation-output")
                        .scrollIntoView({
                            behavior: "smooth",
                        });
                }, 100);
            }, 1350);
        } else {
            buttonElement.removeAttribute("aria-busy");
            buttonElement.setAttribute("class", "w-25");
            toastr.error(data.message);
        }
    }
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Beregn feriepenge</h1>
        <h3 class="top-m">Her kan du regne ud, hvad du kan få i feriepenge</h3>
    </hgroup>
    <form on:submit|preventDefault={calculateHolidayPayment}>
        <div class="grid">
            <div />
            <div>
                <label class="center big-label" for="monthlyIncome">
                    Månedsløn
                </label>
                <input
                    id="monthlyIncome"
                    type="number"
                    bind:value={monthlyIncome}
                />
            </div>
            <div />
        </div>
        <div class="center">
            <button type="submit" class="w-25" id="calculate-holiday"
                >Beregn feriepenge</button
            >
        </div>
    </form>
    {#if holidayData.holidayPayment}
        <div id="vacation-output">
            <h2 class="title-contact">Resultat</h2>
            <div class="center">
                <div>
                    <p class="inline-block p-36">Feriepenge:</p>
                    <h2 class="inline-block">
                        <span class="p-58"
                            >{formatNumber(holidayData.holidayPayment)}</span
                        >
                    </h2>
                    <p class="inline-block p-24">kr.</p>
                </div>
            </div>
            <div class="center">
                <div>
                    <p class="inline-block p-36">Feriedage:</p>
                    <h2 class="inline-block">
                        <span class="p-58"
                            >{formatNumber(holidayData.vacationDays)}</span
                        >
                    </h2>
                    <p class="inline-block p-24">dage</p>
                </div>
            </div>
        </div>
    {/if}
</main>

<style>
    .inline-block {
        display: inline-block;
    }
    .title-contact {
        font-size: 24px;
    }
    #vacation-output h2 {
        font-size: 36px;
    }
    #vacation-output p {
        font-size: 24px;
    }
</style>

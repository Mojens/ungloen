<script>
    export let pageTitle;
    document.title = pageTitle;

    import { BASE_URL } from "../../../stores/globalsStore.js";
    import { startLoading, stopLoading } from "../../../util/loadingButton.js";
    import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.svelte";
    import toastr from "toastr";

    const breadCrumbs = [
		{
			title: "Tjenester",
			path: "/tjenester",
		},
		{
			title: "Feriepenge",
			path: ""
		},
	]

    let holidayData = {};
    let monthlyIncome = 0;

    let calculateHolidayPaymentButtonElement;
    let vacationOutputElement;

    function formatNumber(number) {
        const formattedNumber = number.toLocaleString("da-DK");
        return formattedNumber;
    }

    async function calculateHolidayPayment() {
       startLoading(calculateHolidayPaymentButtonElement);

        const response = await fetch(
            `${$BASE_URL}/api/private/tax/holiday-payment`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    monthlyIncome,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            holidayData = data.holidayPaymentData;
            setTimeout(() => {
                vacationOutputElement.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100);
            stopLoading(calculateHolidayPaymentButtonElement);
        } else {
            toastr.error(data.message);
            stopLoading(calculateHolidayPaymentButtonElement);
        }
    }
</script>

<BreadCrumb breadCrumbs={breadCrumbs} />
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
            <button type="submit" class="w-25" bind:this={calculateHolidayPaymentButtonElement}
                >Beregn feriepenge</button
            >
        </div>
    </form>
    {#if holidayData.holidayPayment}
        <div class="vacation-result" bind:this={vacationOutputElement}>
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
    .vacation-result h2 {
        font-size: 36px;
    }
    .vacation-result p {
        font-size: 24px;
    }
</style>

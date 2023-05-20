<script>
	export let pageTitle;
	document.title = pageTitle;

	import { BASE_URL } from "../../../stores/globalsStore.js";
	import { incomeTypes } from "../../../stores/taxStore.js";
	import { startLoading, stopLoading } from "../../../util/loadingButton.js";
	import { onMount } from "svelte";
	import { Link } from "svelte-navigator";
	import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.svelte";
	import toastr from "toastr";

	const breadCrumbs = [
		{
			title: "Tjenester",
			path: "/tjenester",
		},
		{
			title: "Månedsløn",
			path: ""
		},
	]

	let showForm = false;
	let userPersonalData = {};
	let incomeType = "";
	let payoutTime = "";
	let monthlyIncome = 0;
	let headOrBiCard = "";
	let monthlyPayoutData = {};

    let calculateMonthlyPayoutButtonElement;

	function toggleForm() {
		monthlyPayoutData = {};
		if (incomeType !== "") {
			showForm = true;
		} else {
			showForm = false;
		}
	}

	function formatNumber(number) {
		const formattedNumber = number.toLocaleString("da-DK", {
			minimumFractionDigits: 2,
		});
		return formattedNumber;
	}

	async function getTaxData() {
		const response = await fetch(`${$BASE_URL}/api/private/users/tax/data`, {
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
        startLoading(calculateMonthlyPayoutButtonElement);
        
		const response = await fetch(
			`${$BASE_URL}/api/private/tax/monthly-payout`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					tax_rate: userPersonalData.tax_rate,
					monthly_deduction: userPersonalData.monthly_deduction,
					incomeType: incomeType,
					payoutTime: payoutTime,
					monthlyIncome: monthlyIncome,
					headOrBiCard: headOrBiCard,
				}),
			}
		);
		const data = await response.json();
		if (response.status === 200) {
			monthlyPayoutData = data.monthlyPayoutData;
			setTimeout(() => {
				document.getElementById("udbetaling-output").scrollIntoView({
					behavior: "smooth",
				});
			}, 100);
            stopLoading(calculateMonthlyPayoutButtonElement);
		} else {
			toastr.error(data.message);
            stopLoading(calculateMonthlyPayoutButtonElement);
		}
	}

	onMount(async () => {
		await getTaxData();
	});
</script>

<BreadCrumb breadCrumbs={breadCrumbs} />
<main class="container">
	{#if userPersonalData.tax_rate && userPersonalData.monthly_deduction}
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
				on:change={toggleForm}
				required
			>
				<option
					value=""
					disabled
					selected>Vælg en Indkomsttype</option
				>
				{#each $incomeTypes as incomeType}
					<option value={incomeType}>{incomeType}</option>
				{/each}
			</select>
		</div>
		{#if showForm !== false}
			<h3>
				Udfyld formen med din indkomst, og se hvad du ca. får udbetalt før skat.
			</h3>
			<form
				id="løn-form"
				on:submit|preventDefault={calculateMonthlyPayout}
			>
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
									checked
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
				<button
					type="submit"
					bind:this={calculateMonthlyPayoutButtonElement}>Beregn</button
				>
			</form>
		{/if}
	{:else}
		<hgroup>
			<h1 class="title-contact">Kune ikke indlæse dine personoplysninger.</h1>
			<h3>
				Husk at indtaste alle felter under <Link to="/profil/personlig"
					>Dine personlige oplysninger</Link
				>
			</h3>
		</hgroup>
	{/if}

	{#if monthlyPayoutData.payout}
		<div
			id="udbetaling-output"
			class="container"
		>
			<h2 class="title">Udbetaling</h2>
			<p>Her kan du se hvad du får udbetalt, før du får din lønseddel.</p>

			<div class="grid">
				<div>{monthlyPayoutData.incomeType}</div>
				<div>{formatNumber(monthlyPayoutData.monthlyIncome)} kr.</div>
			</div>

			{#if monthlyPayoutData.incomeType === "Løn"}
				<div class="grid">
					<div>
						AM-bidrag: <b>{monthlyPayoutData.laborContributionRate}%</b>
						af {formatNumber(monthlyPayoutData.monthlyIncome)}
						kr.
						<a
							class="tooltip-large"
							data-tooltip="
                        Arbejdsmarkedsbidrag (AM-bidrag) er en skat på 8 %, som du betaler af alt løn.
                        Din arbejdsgiver trækker AM-bidraget af din løn, efter at ATP og eget pensionsbidrag er fratrukket,
                        men før den øvrige skat trækkes.
                        "><i class="fa fa-question-circle" /></a
						>
					</div>
					<div>
						- {formatNumber(monthlyPayoutData.laborContribution)} kr.
					</div>
				</div>
			{/if}

			<div class="grid">
				<div>
					A-skat: <b>{monthlyPayoutData.tax_rate}%</b> af {formatNumber(
						monthlyPayoutData.AIncome
					)} kr.
					<a
						class="tooltip-large"
						data-tooltip="
                        Regnestykket for A-skat er:
                        (Indkomst før AM-bidrag) - (AM-bidrag) - (Fradrag) = (A-indkomst)
                        Hvis du ikke er lønmodtager betaler du ikke AM-bidrag, og hvis du har valgt bikort bliver fradraget ikke tælt med.
                        "><i class="fa fa-question-circle" /></a
					>
				</div>
				<div>- {formatNumber(monthlyPayoutData.taxToPay)} kr.</div>
			</div>

			<hr />

			<div class="grid">
				{#if monthlyPayoutData.payoutTime === "monthly"}
					<div class="cell">
						Nettoudbetalt (efter skat) / måned:
						{#if monthlyPayoutData.headOrBiCard === "headCard"}
							<br />
							<small class="small"
								>Anvendt skattekort på denne indkomst: Hovedkort</small
							>
						{:else}
							<br />
							<small class="small"
								>Anvendt skattekort på denne indkomst: Bikort</small
							>
						{/if}
					</div>
				{:else}
					<div class="cell">
						Nettoudbetalt (efter skat) / 2. uge:
						{#if monthlyPayoutData.headOrBiCard === "headCard"}
							<br />
							<small class="small"
								>Anvendt skattekort på denne indkomst: Hovedkort</small
							>
						{:else}
							<br />
							<small class="small"
								>Anvendt skattekort på denne indkomst: Bikort</small
							>
						{/if}
					</div>
				{/if}
				<div class="cell bold">
					<b>{formatNumber(monthlyPayoutData.payout)} kr.</b>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.small {
		margin-top: 0;
		padding-top: 0;
		position: absolute;
		font-size: x-small !important;
		font-weight: bold;
	}
	.cell {
		padding-bottom: 0;
	}
</style>

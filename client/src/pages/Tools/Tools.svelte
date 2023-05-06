<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { BASE_URL, carousel_articles } from "../../stores/globalsStore.js";
    import Articles from "../../components/Articles/Articles.svelte";
    import toastr from "toastr";


    const navigate = useNavigate();
    const location = useLocation();

    async function checkSession(redirectLocation) {
        const response = await fetch($BASE_URL + "/api/check-session", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            const from = ($location.state && $location.state.from) || redirectLocation;
            navigate(from, { replace: true });
        } else {
            toastr.error(data.message);
            const from = ($location.state && $location.state.from) || "/log-ind";
            navigate(from, { replace: true });
        }
    }
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Vores tjenester</h1>
        <h3>
            Her får du et overblik over de forskellige tjenester som vi
            tilbyder.
        </h3>
    </hgroup>
    <div class="grid">
        <div>
            <article>
                <header class="center">
                    <h2 class="down-m">Beregn Månedsløn</h2>
                </header>
                Angiv hvor mange timer du har arbejdet, og se hvor meget du får udbetalt.

                <footer>
                    <p class="properties">Kræver du har en bruger</p>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class="card-end" on:click={() => checkSession("/tjenester/beregn-maanedsloen")}
                        ><i class="fa fa-arrow-circle-o-right fa-2x" /></a
                    >
                </footer>
            </article>
        </div>
        <div>
            <article>
                <header class="center">
                    <h2 class="down-m">Beregn Kørselsfradag</h2>
                </header>
                Angiv din arbejdsplads, og se hvor meget du kan få i kørselsfrdag,
                og indtast det ind i din forskudsopgørelse.
                <footer>
                    <p class="properties">Kræver du har en bruger</p>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <a class="card-end" on:click={() => checkSession("/tjenester/beregn-koerselsfradrag")}
                        ><i class="fa fa-arrow-circle-o-right fa-2x" /></a
                    >
                </footer>
            </article>
        </div>
    </div>

    <div class="grid">
        <div>
            <article>
                <header class="center">
                    <h2 class="down-m">Beregn Feriepenge</h2>
                </header>
                Angiv hvor mange timer du arbejder gennemsnitligt om måneden, og
                se hvor meget du kan få udbetalt i feriepenge.
                <footer>
                    <p class="properties">Kræver du har en bruger</p>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <a class="card-end" on:click={() => checkSession("/tjenester/beregn-feriepenge")}
                        ><i class="fa fa-arrow-circle-o-right fa-2x" /></a
                    >
                </footer>
            </article>
        </div>
        <div>
            <article>
                <header class="center">
                    <h2 class="down-m">Skriv dine egne indlæg</h2>
                </header>
                Du bliver en del af vores forum, hvor der er mulighed for at skrive
                indlæg, kommentere på andres indlæg og blive klogere på din økonomi.
                <footer>
                    <p class="properties">Kræver du har en bruger</p>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <a class="card-end" on:click={() => checkSession("/tjenester/forum")}
                        ><i class="fa fa-arrow-circle-o-right fa-2x" /></a
                    >
                </footer>
            </article>
        </div>
    </div>

    <Articles amountToShow={2} amountOnScroll={1} articles={$carousel_articles} />
</main>

<style>
    .properties {
        font-style: italic;
        margin-top: 5px;
        font-size: small;
        float: left;
    }
</style>

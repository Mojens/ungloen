<script>
    export let pageTitle;
    document.title = pageTitle;

    import { Link } from "svelte-navigator";
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
                    <a class="card-end"
                        ><Link to="/tjenester/beregn-maanedsloen"
                            ><i
                                class="fa fa-arrow-circle-o-right fa-2x"
                            /></Link
                        ></a
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
                    <a class="card-end"
                        ><Link to="/tjenester/beregn-koerselsfradrag"
                            ><i
                                class="fa fa-arrow-circle-o-right fa-2x"
                            /></Link
                        ></a
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
                    <a class="card-end"
                        ><Link to="/tjenester/beregn-feriepenge"
                            ><i
                                class="fa fa-arrow-circle-o-right fa-2x"
                            /></Link
                        ></a
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
                    <a class="card-end"
                        ><Link to="/tjenester/forum"
                            ><i
                                class="fa fa-arrow-circle-o-right fa-2x"
                            /></Link
                        ></a
                    >
                </footer>
            </article>
        </div>
    </div>
    <div class="grid">
        <div>
            <article>
                <header class="center">
                    <h2 class="down-m">Share Dollar</h2>
                </header>
                Share Dollar en funktion, som gør det muligt at lave dine egne teams,
                og dele jeres regninger med hinanden. Så alle betaler deres andel
                af regningen.
                <footer>
                    <p class="properties">Kræver du har en bruger</p>
                    <a class="card-end"
                        ><Link to="/tjenester/share-dollar"
                            ><i
                                class="fa fa-arrow-circle-o-right fa-2x"
                            /></Link
                        ></a
                    >
                </footer>
            </article>
        </div>
    </div>
</main>

<style>
    .properties {
        font-style: italic;
        margin-top: 5px;
        font-size: small;
        float: left;
    }
</style>

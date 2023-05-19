<script>
  document.title = "UngLøn | Forside";
  import Slider from "../../components/Slider/Slider.svelte";
  import Articles from "../../components/Articles/Articles.svelte";
  import {
    frontPageImages,
    carousel_articles,
  } from "../../stores/sliderStore.js";
</script>

<main class="container top-m">
  <div class="center">
    <hgroup>
      <h1 class="center top-m down-m title">UngLøn</h1>
      <h2>Få styr på din økonomi med vores gratis værktøjer</h2>
    </hgroup>
  </div>
  <Slider carouselPhotos={$frontPageImages} />
  <div>
    <h2 class="title top-m down-m">Hvad tilbyder vi?</h2>
    <details>
      <summary>Beregn din nettoløn</summary>
      <p>
        Indtast din bruttoløn og skat for at beregne, hvor meget du får udbetalt
        hver måned.
      </p>
    </details>
    <details>
      <summary>Lav din årsopgørelse med lethed</summary>
      <p>Følg vores trin-for-trin vejledning for at lave din årsopgørelse.</p>
    </details>
    <details>
      <summary>Få hjælp i vores åbne forum</summary>
      <p>
        Stil spørgsmål og få svar fra vores økonomi-eksperter og andre brugere.
      </p>
    </details>
    <details>
      <summary>Lav dit eget team</summary>
      <p>
        Lav et budget og del det med dine venner eller familie for at holde dig
        ansvarlig.
      </p>
    </details>
  </div>
  <div class="get-started">
    <h2 class="title top-m down-m">Kom i gang i dag!</h2>
    <p class="paragraph">
      Få styr på din økonomi med vores gratis værktøjer. Vores hjemmeside har
      til formål at hjælpe unge mennesker med at tage kontrol over deres
      økonomi. Du kan beregne din nettoløn, lave din årsopgørelse med lethed, og
      få hjælp i vores åbne forum. Lav et budget og del det med dit team, så I
      kan holde hinanden ansvarlige. Med vores værktøjer kan du føle dig mere
      selvsikker i forhold til din økonomi.
    </p>
    <a href="/opret-bruger">
      <button type="button"> Opret dig selv idag! </button>
    </a>
  </div>
  <Articles amountToShow={2} amountOnScroll={1} articles={$carousel_articles} />
</main>

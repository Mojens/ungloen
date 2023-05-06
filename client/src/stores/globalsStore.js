import { readable } from "svelte/store";
import { writable } from "svelte/store";

const savedUser = JSON.parse(localStorage.getItem("user"));
export const user = writable(savedUser || null);

export const BASE_URL = readable("http://localhost:8080");
export const forum_subjects = readable(["Årsopgørelse", "Skat", "Løn", "Andet"]);
export const frontPageImages = readable([
    {
        src: "https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Blå penge gris",
    },
    {
        src: "https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Pige med shopping poser, og shopper online",
    },
    {
        src: "https://images.pexels.com/photos/853151/pexels-photo-853151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        alt: "Kæreste par der shopper online",
    },
]);
export const carousel_articles = readable([
    {
        title: "Officiel hjemmeside for SKAT",
        imgURL: "https://billeder.lokalavisen.dk/dfrbPskm6TZ0vJZiBWAhwNYLRaMnkyH9Rbgxg1raLuI/resize:fill:940:0:0/plain/https%3A%2F%2Fbilleder.lokalavisen.dk%2Fpictures%2Fimage%2F14542935%2Fhbb1pe%2FALTERNATES%2Fmaster-3_2%2F20160318-190521-pf-4307x3280ma-jpg",
        url: "https://skat.dk/data.aspx?oid=3439",
        intro_text:
            "Her kan du finde alt om skat, og hvordan du skal forholde dig til det.",
        author: "SKAT",
    },
    {
        title: "Alt du skal vide om skat",
        imgURL: "https://omnibus.au.dk/fileadmin/_processed_/2/3/csm_skat2_716e20c0f3.jpg",
        url: "https://omnibus.au.dk/arkiv/vis/artikel/guide-alt-du-som-studerende-skal-vide-om-skat",
        intro_text:
            "Du kommer ikke udenom skattefar – han står der hver måned og inddrager en del af din SU og din hårdt tjente løn. Så her er alt, du skal vide om frikort, bikort, hovedkort og forskudsopgørelse.",
        author: "Omnibus",
    },
    {
        title: "Ansættelseskontrakt",
        imgURL: "https://www.nykredit.dk/globalassets/billeder/erhverv/logoer_kundefordele/legal-desk_1400x788--size-ArticleHero--version-20221111113354.png",
        url: "https://www.legaldesk.dk/erhverv/ansaettelseskontrakt/mindsteloen",
        intro_text:
            "Mange tror, at det udelukkende er loven, der bestemmer mindstelønnen, men det er ikke altid tilfældet. Reglerne for mindsteløn varierer alt afhængigt af, om du er omfattet af en overenskomst eller er privatansat, og om du er over eller under 18 år.",
        author: "Legal Desk",
    },
    {
        title: "Skat for teenagere",
        imgURL: "https://billeder.lokalavisen.dk/dfrbPskm6TZ0vJZiBWAhwNYLRaMnkyH9Rbgxg1raLuI/resize:fill:940:0:0/plain/https%3A%2F%2Fbilleder.lokalavisen.dk%2Fpictures%2Fimage%2F14542935%2Fhbb1pe%2FALTERNATES%2Fmaster-3_2%2F20160318-190521-pf-4307x3280ma-jpg",
        url: "https://www.bdo.dk/da-dk/faglig-info/depechen/depechen-artikler-2021/skat-for-teenagere",
        intro_text:
            "Fra og med det år, hvori du fylder 15 år, udskriver Skattestyrelsen automatisk en forskudsopgørelse med et frikort til dig. Du får ingen besked fra styrelsen om det, men hvis du logger dig ind på skat.dk, kan du se opgørelsen.",
        author: "BDO - Danmark",
    },
    {
        title: "Løn eller skattefri godtgørelse?",
        imgURL: "https://www.dgi.dk/media/1627/penge-2.jpg?anchor=center&mode=crop&width=712&heightratio=0.5589887640449438202247191011&format=jpg&slimmage=true&quality=90&rnd=130607855530000000&bgcolor=ffffff&format=jpg",
        url: "https://www.dgi.dk/foreningsledelse/viden-vaerktoejer/viden-vaerktoejer/oekonomi-indtjening/loen-eller-skattefri-godtgoerelse",
        intro_text:
            "Skal træneren have løn eller skattefri godtgørelse? Dyk ned i reglerne her.",
        author: "DGI",
    },
]);
import { readable } from "svelte/store";

export const forum_subjects = readable(["Årsopgørelse", "Skat", "Løn", "ShareDollar", "Andet"]);

export const incomeTypes = readable(["Løn", "SU", "Dagpenge (A-kasse) eller kontanthjælp", "Efterløn", "Pension"]);
/*
  Fasada warstwy danych dla zwierząt. Strony importują funkcje WYŁĄCZNIE stąd.
  Dziś przekazujemy dalej implementację mock (localStorage); po napisaniu backendu
  ta linia zmieni się na moduł z `fetch`, a strony zostaną bez zmian.
*/
export * from './mock/pets.js'

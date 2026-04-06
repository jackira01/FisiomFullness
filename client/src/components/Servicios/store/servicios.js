import { atom } from "jotai";

export const filtersAtom = atom({
  search: [],
  specialtyId: "",
  state: "",
  city: "",
  country: "",
  page: 1,
});


export const locationAtom = atom({
  user: [0, 0]
});


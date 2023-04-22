import { DocumentData } from "firebase/firestore";
import { atom } from "recoil";
import { Movie } from "../typings";

// const textState = atom({
//     key: 'textState', // unique ID (with respect to other atoms/selectors)
//     default: '', // default value (aka initial value)
//   });

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const movieState = atom<Movie | DocumentData | null>({
  key: "movieState",
  default: null,
});

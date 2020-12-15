import { writable } from "svelte/store";

export const currentPageStore = writable("mainView");
export const itemIdStore = writable("");

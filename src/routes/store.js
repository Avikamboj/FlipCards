import { writable } from "svelte/store";

export let rows = writable(6);
export let cols = writable(6);
export let level = writable(2);
export let play = writable(false);
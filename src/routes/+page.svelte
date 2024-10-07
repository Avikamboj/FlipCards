<script lang="ts">
    import { play } from "./store";
    import SetLayout from "./setLayout.svelte";
    import Game from "./game.svelte";
    import { onDestroy } from "svelte";

    let playGame: Boolean;
    let unsubscribe = play.subscribe((val) => {
        playGame = val;
        return val;
    });

    onDestroy(unsubscribe);
</script>

<main>
    {#if playGame}
        <Game />
    {:else}
        <SetLayout />
    {/if}
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
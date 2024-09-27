<script lang="ts">
    import { rows, cols, level, play } from "./store";

    let r: number;
    let c: number;

    function letsPlay() {
        play.update((val) => {
            val = true;
            return val;
        });
    }
</script>

<main>
    <div class="container">
        <div class="header">
            <p>!Flip The Cards!</p>
            <p>Game</p>
        </div>

        <div class="modes">
            <div><h1>Select Hardness</h1></div>
            <div class="btns">
                <button
                    id="easy"
                    on:click={() => {
                        level.update((val) => (val = 1));
                        r = 4;
                        rows.update((val) => {
                            val = r;
                            return val;
                        });
                        c = 4;
                        cols.update((val) => {
                            val = c;
                            return val;
                        });
                    }}>Easy</button
                >

                <button
                    id="medium"
                    on:click={() => {
                        level.update((val) => (val = 2));
                        r = 6;
                        rows.update((val) => {
                            val = r;
                            return val;
                        });
                        c = 6;
                        cols.update((val) => {
                            val = c;
                            return val;
                        });
                    }}>Medium</button
                >

                <button
                    id="hard"
                    on:click={() => {
                        level.update((val) => (val = 3));
                        r = 8;
                        rows.update((val) => {
                            val = r;
                            return val;
                        });
                        c = 8;
                        cols.update((val) => {
                            val = c;
                            return val;
                        });
                    }}>Hard</button
                >
            </div>

            <p style="text-align: center; margin: 10px 0">
                <strong>Level: </strong>
                {#if $level === 1}
                    Easy
                {:else if $level === 2}
                    Medium
                {:else}
                    Hard
                {/if}
            </p>
        </div>
        <button id="playBtn" type="button" on:click={letsPlay}>Play</button>
    </div>
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .header {
        text-align: center;
    }

    .container {
        border: 1px solid black;
        padding: 10px;
        width: fit-content;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .container h1 {
        text-align: center;
        border-bottom: 1px solid black;
        margin: 5px 0;
    }

    .modes {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #easy,
    #medium,
    #hard {
        color: white;
        padding: 5px;
        border: none;
        border-radius: 8px;
    }

    #easy {
        background-color: rgb(65, 65, 255);
    }
    #medium {
        background-color: green;
    }
    #hard {
        background-color: red;
    }

    #playBtn {
        border: 1px solid black;
        &:active {
            background-color: lightgreen;
        }
    }
</style>

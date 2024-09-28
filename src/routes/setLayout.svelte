<script lang="ts">
    import { rows, cols, level, play, countDown } from "./store";

    let r: number;
    let c: number;

    function letsPlay() {
        play.update((val) => {
            val = true;
            return val;
        });

        countDown.update((timer) => {
            timer.isRunning = true;
            return timer;
        });
    }
</script>

<main>
    <div class="container">
        <div class="header">
            <h1>!Flip The Cards!</h1>
            <h2>Game</h2>
        </div>

        <div class="modes">
            <div><h3>Select Hardness</h3></div>
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
                    }}
                    style="transform: {$level===1?'scale(1.2)':''}"
                    >Easy</button
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
                    }}
                    style="transform: {$level===2?'scale(1.2)':''}"
                    >Medium</button
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
                    }}
                    style="transform: {$level===3?'scale(1.2)':''}"
                    >Hard
                </button>
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

    .container div:first-child{
        width: 100%;
    }

    .container h3 {
        width: 100%;
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
        transition-duration: .2s;
    }

    #easy {
        background-color: rgb(65, 65, 255);
        &:hover {
            background-color: rgb(30, 30, 249);
        }
    }
    #medium {
        background-color: rgb(3, 149, 3);
        &:hover {
            background-color: rgb(1, 110, 1);
        }
    }
    #hard {
        background-color: rgb(250, 4, 4);
        &:hover {
            background-color: rgb(147, 3, 3);
        }
    }

    #playBtn {
        border: 1px solid black;
        &:active {
            background-color: lightgreen;
        }
    }
</style>

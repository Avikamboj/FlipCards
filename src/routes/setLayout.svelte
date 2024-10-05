<script lang="ts">
    import { onMount } from "svelte";
    import incrementTimer from "./game.svelte";
    import { rows, cols, level, play, countDown } from "./store";

    let r: number;
    let c: number;

    let isFlipped: boolean;

    onMount(() => {
        isFlipped = false;
    });

    const letsPlay = () => {
        setTimeout(() => {
            play.update((val) => {
                val = true;
                return val;
            });
        }, 200);

        countDown.update((timer) => {
            timer.isRunning = true;
            return timer;
        });
    }
</script>

<main>
    <div class="container {isFlipped ? 'flipped' : ''}">
        <div class="front">
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
                        style="transform: {$level === 1 ? 'scale(1.2)' : ''}"
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
                        style="transform: {$level === 2 ? 'scale(1.2)' : ''}"
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
                        style="transform: {$level === 3 ? 'scale(1.2)' : ''}"
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
            <button
                id="playBtn"
                type="button"
                on:click={() => {
                    isFlipped = true;
                    letsPlay();
                }}
            >
                Play
            </button>
        </div>

        <div class="back"></div>
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

    .container {
        padding: 20px;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
        box-sizing: border-box;
        transition: transform 0.2s;
        transform-style: preserve-3d;
    }

    .header {
        text-align: center;
    }

    .front,
    .back {
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        backface-visibility: hidden;
    }

    .front {
        overflow: hidden;
    }

    .back {
        transform: rotateY(180deg);
        /* font-size: 2em; */
        position: absolute;
        top: 0;
    }

    .flipped {
        transform: rotateY(180deg);
        /* scale: 10; */
    }

    .container div:first-child {
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
        transition-duration: 0.2s;
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

    .btns {
        display: flex;
        gap: 8px;
    }

    #playBtn {
        padding: 2px 20px;
        border: 1px solid black;
        &:active {
            background-color: lightgreen;
            border: none;
        }
    }
</style>

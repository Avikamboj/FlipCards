<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { rows, cols, level, play, countDown } from "./store";
    import Front from "./CardFront.jpg";
    import Front2 from "./CardFront2.jpg";
    import Winner from "./winner.svelte";

    let values: number[] = [];
    let cards: any = {};

    let rep = 1;
    for (let i = 1; i <= Math.floor(($rows * $cols) / 2); i++) {
        while (rep <= 2) {
            values.push(i);
            rep++;
        }
        rep = 1;
    }

    for (let i = 0; i < $rows * $cols; i++) {
        cards[i] = {
            isFlipped: false,
            isMatched: false,
            value: 0,
            freeze: false,
        };
    }

    let arr = [...values];
    let v = 0;
    while (arr.length > 0) {
        let randomIndex = Math.floor(Math.random() * arr.length);
        let pickedValue = arr.splice(randomIndex, 1)[0];
        cards[v].value = pickedValue;
        v++;
    }

    let runTimeGap: any;
    let gameComplete: boolean = false;
    onMount(() => {
        setTimeout(() => {
            for (let i = 0; i < Object.keys(cards).length; i++) {
                cards[i].isFlipped = true;
            }
        }, 400);

        setTimeout(() => {
            for (let i = 0; i < Object.keys(cards).length; i++) {
                cards[i].isFlipped = false;
            }
        }, 800);

        setTimeout(() => {
            runTimer();
        }, 1200);
    });

    let isPaused: boolean = false;

    let timeRun = false;
    let unsubscribe = countDown.subscribe((val) => {
        timeRun = val.isRunning;
    });

    const toggleButton = () => {
        if (!isPaused) {
            stopTimer();
            freezeCards();
        } else {
            runTimer();
            unfreezeCards();
        }
        isPaused = !isPaused;
    };

    function runTimer() {
        timeRun = true;
        runTimeGap = setInterval(incrementTime, 1000);
    }

    function stopTimer() {
        timeRun = false;

        clearInterval(runTimeGap);
        countDown.update((timer) => {
            timer.isRunning = false;
            return timer;
        });
    }

    function resetTimer() {
        countDown.update((timer) => {
            timer.isRunning = false;
            timer.second = 0;
            timer.minute = 0;
            // timer.hour = 0;
            return timer;
        });
    }

    function incrementTime() {
        if (!timeRun) return;

        countDown.update((timer) => {
            timer.second++;

            if (timer.second >= 60) {
                timer.second = 0;
                timer.minute++;
            }

            // if (timer.minute >= 60) {
            //     timer.minute = 0;
            //     timer.hour++;
            // }

            return timer;
        });
    }

    // -----FREEZE / UNFREEZE THE CARDS ------

    const freezeCards = () => {
        // debugger;
        Object.keys(cards).forEach((key) => {
            cards[key].freeze = true;
        });
    };

    const unfreezeCards = () => {
        // debugger;
        Object.keys(cards).forEach((key) => {
            cards[key].freeze = false;
        });
    };

    // MAIN LOGIC TO FLIP CARD AND FIND MATCH

    let matches: number[] = [];
    let flip = 0;
    function flipCard(index: number) {
        // debugger;
        if (cards[index].isMatched || cards[index].freeze) return;

        cards[index].isFlipped = !cards[index].isFlipped;

        if (flip < 2) {
            matches[flip] = index;
            flip++;
        }
        // console.log(matches);
        if (flip === 2) {
            checkMatch(matches[0], matches[1]);
        }
    }

    const checkMatch = (firstInd: number, secondInd: number) => {
        let firstVal = cards[firstInd].value;
        let secondVal = cards[secondInd].value;

        if (firstVal === secondVal && firstInd !== secondInd) {
            let cardBtn = document.getElementsByClassName("card");
            const firstCard = cardBtn[firstInd] as HTMLElement;
            const secondCard = cardBtn[secondInd] as HTMLElement;
            const firstCardBack = firstCard.querySelector(
                ".card-back",
            ) as HTMLElement;
            const secondCardBack = secondCard.querySelector(
                ".card-back",
            ) as HTMLElement;

            setTimeout(() => {
                firstCardBack.style.backgroundColor = "green";
                secondCardBack.style.backgroundColor = "green";
                firstCard.style.color = "white";
                secondCard.style.color = "white";
            }, 500);

            cards[firstInd].isMatched = true;
            cards[secondInd].isMatched = true;
            firstCardBack.style.cursor = "not-allowed";
            firstCardBack.style.pointerEvents = "none";
            secondCardBack.style.cursor = "not-allowed";
            secondCardBack.style.pointerEvents = "none";
        } else {
            setTimeout(() => {
                cards[firstInd].isFlipped = false;
                cards[secondInd].isFlipped = false;
                const firstCard = document.getElementsByClassName("card")[
                    firstInd
                ] as HTMLElement;
                const secondCard = document.getElementsByClassName("card")[
                    secondInd
                ] as HTMLElement;
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
            }, 800);
        }
        matches = [];
        flip = 0;

        let allMatched = Object.values(cards).every(
            (card: any) => card.isMatched,
        );

        if (allMatched) {
            stopTimer();
            gameComplete = true;
        }
        console.log(gameComplete);
    };
    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="main">
    <div class="time">
        <p>
            {#if $countDown.minute < 10}
                0{$countDown.minute}:
            {:else}
                {$countDown.minute}:
            {/if}
            {#if $countDown.second < 10}
                0{$countDown.second}
            {:else}
                {$countDown.second}
            {/if}
        </p>
    </div>
    <div
        class={`container ${$level === 1 ? "easyGrid" : $level === 2 ? "normGrid" : "hardGrid"}`}
    >
        {#each Array(Math.floor($rows * $cols)) as _, index}
            <button
                class={`card ${cards[index].isFlipped ? "flipped" : ""}`}
                on:click={() => flipCard(index)}
            >
                <div class="card-front">
                    {#if index % 2 === 0}
                        <img src={Front} alt="Even Card" />
                    {:else}
                        <img src={Front2} alt="Even Card" />
                    {/if}
                </div>
                <div class="card-back">{cards[index].value}</div>
            </button>
        {/each}
    </div>
    <div class="btn">
        <button
            on:click={() => {
                resetTimer();
                play.update((val) => (val = false));
            }}>Restart</button
        >
        <button
            on:click={() => {
                toggleButton();
            }}
            disabled={gameComplete ? true : false}
            >{isPaused ? "Play" : "Pause"}</button
        >
    </div>
</div>

{#if gameComplete}
    <Winner />
{/if}

<style>
    .main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .container {
        display: grid;
        gap: 2px;
        width: fit-content;
        /* max-width: 400px; */
        margin: 0 auto;
        padding: 2px;
    }

    .easyGrid {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
    }

    .normGrid {
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(6, 1fr);
    }

    .hardGrid {
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
    }

    .time {
        margin: 20px;
        font-size: 2em;
        transition: all 0.2s;
    }

    .card {
        user-select: none;
        cursor: pointer;
        height: calc(100vw / 4-2px);
        width: calc(100vw / 4-2px);
        max-height: 80px;
        max-width: 70px;
        text-align: center;
        border: 1px solid red;
        transition: transform 0.5s;
        transform-style: preserve-3d;
    }

    @media (max-width: 480px) {
        .easyGrid .card {
            height: calc(100vw / 4 - 2px);
            width: calc(100vw / 4 - 2px);
        }

        .normGrid .card {
            height: calc(100vw / 6 - 2px);
            width: calc(100vw / 6 - 2px);
        }

        .hardGrid .card {
            height: calc(100vw / 8 - 2px);
            width: calc(100vw / 8 - 2px);
        }
    }

    /* @media (max-width: 320px) {
        .normGrid .card {
            max-height: 55px;
            max-width: 45px;
        }

        .hardGrid .card {
            max-height: 35px;
            max-width: 30px;
            font-size: 0.8em;
        }
    } */

    .flipped {
        transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
    }

    .card-front {
        overflow: hidden;
    }

    .card-back {
        background-color: #ccc;
        transform: rotateY(180deg);
        font-size: 2em;
        position: absolute;
        top: 0;
    }

    .card-front img {
        height: 100%;
        object-fit: contain;
    }

    .btn {
        user-select: none;
        cursor: pointer;
    }
</style>

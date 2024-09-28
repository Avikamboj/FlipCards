<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { rows, cols, level, play, countDown } from "./store";
    import Front from "./CardFront.jpg";
    import Front2 from "./CardFront2.jpg";

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
        cards[i] = { isFlipped: false, isMatched: false, value: 0 };
    }

    let arr = [...values];
    let v = 0;
    while (arr.length > 0) {
        let randomIndex = Math.floor(Math.random() * arr.length);
        let pickedValue = arr.splice(randomIndex, 1)[0];
        cards[v].value = pickedValue;
        v++;
    }

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
    });

    let timeRun = false;

    let unsubscribe = countDown.subscribe((val) => {
        timeRun = val.isRunning;
    });

    if (timeRun) {
        setTimeout(() => {
            incrementTime();
        }, 1500);
    }

    function stopTimer() {
        timeRun = false;
        countDown.update((timer) => {
            timer.isRunning = false;
            return timer;
        });
    }

    function resetTimer() {
        countDown.update((timer) => {
            timer.isRunning = false;
            timer.miliSecond = 0;
            timer.second = 0;
            timer.minute = 0;
            timer.hour = 0;
            return timer;
        });
    }

    function incrementTime() {
        if (!timeRun) return;

        countDown.update((timer) => {
            timer.miliSecond++;

            if (timer.miliSecond >= 100) {
                timer.miliSecond = 0;
                timer.second++;
            }

            if (timer.second >= 60) {
                timer.second = 0;
                timer.minute++;
            }

            if (timer.minute >= 60) {
                timer.minute = 0;
                timer.hour++;
            }

            return timer;
        });

        setTimeout(incrementTime, 8);
    }

    let matches: number[] = [];
    let flip = 0;
    function flipCard(index: number) {
        if (cards[index].isMatched) return;

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

        let allMatched = Object.values(cards).every((card) => card.isMatched);
        // Object.values(cards).forEach((card) => {
        //     if (!card.isMatched) {
        //         allMatched = false;
        //     }
        // });

        if (allMatched) {
            stopTimer();
        }
    };
    onDestroy(unsubscribe);
</script>

<div class="main">
    <div class="time">
        <p>
            {$countDown.hour}:{$countDown.minute}:{$countDown.second}:{$countDown.miliSecond}
        </p>
    </div>
    <div
        class="container"
        style="grid-template-columns: {$level === 1
            ? 'repeat(4, 1fr)'
            : $level === 2
              ? 'repeat(6, 1fr)'
              : 'repeat(8, 1fr)'}; 
          grid-template-rows:{$level === 1
            ? 'repeat(4, 1fr)'
            : $level === 2
              ? 'repeat(6, 1fr)'
              : 'repeat(8, 1fr)'};"
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
    </div>
</div>

<style>
    .main {
        background-color: gray;
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .container {
        display: grid;
        height: fit-content;
        width: fit-content;
        background-color: skyblue;
        gap: 5px;
        border: 1px solid black;
        padding: 5px;
    }

    .card {
        user-select: none;
        cursor: pointer;
        height: 80px;
        width: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
        box-sizing: border-box;
        transition: transform 0.5s;
        transform-style: preserve-3d;
    }

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
        aspect-ratio: 3/2;
    }

    .btn {
        user-select: none;
        cursor: pointer;
    }
</style>

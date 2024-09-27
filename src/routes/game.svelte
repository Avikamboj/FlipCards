<script lang="ts">
    import { onMount } from "svelte";
    import { rows, cols, level, play } from "./store";
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

    for (let i = 0; i <= $rows * $cols; i++) {
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

        if (firstVal === secondVal) {
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
    };
</script>

<div class="main">
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
        <button on:click={() => {play.update((val) => val = false)}}>Restart</button>
    </div>
</div>

<style>
    .main {
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

    .container > .card:nth-child(even) > div:first-child {
        background-image: url(../../static/CardFront.jpg);
    }

    .container > .card:nth-child(odd) > div:first-child {
        background-image: url(../../static/CardFront2.jpg);
    }

    .card {
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
        background-color: #f0f0f0;
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
        object-fit: cover;
    }
</style>

<script lang="ts">
    import { countDown, play } from "./store";
    import resetTimer from "./game.svelte";

    let W = window.innerWidth;
    let H = window.innerHeight;
    const maxConfettis = 150;
    const particles: ConfettiParticle[] = [];
    
    const possibleColors = [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "Pink",
        "SlateBlue",
        "LightBlue",
        "Gold",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson",
    ];

    // Function to get a random number between a range
    function randomFromTo(from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    // ConfettiParticle class definition
    class ConfettiParticle {
        x: number;
        y: number;
        r: number;
        d: number;
        color: string;
        tilt: number;
        tiltAngle: number;
        tiltAngleIncremental: number;

        constructor() {
            this.x = Math.random() * W; // x
            this.y = Math.random() * H - H; // y
            this.r = randomFromTo(11, 33); // radius
            this.d = Math.random() * maxConfettis + 11;
            this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
            this.tilt = Math.floor(Math.random() * 33) - 11;
            this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
            this.tiltAngle = 0;
        }

        draw(context: CanvasRenderingContext2D) {
            context.beginPath();
            context.lineWidth = this.r / 2;
            context.strokeStyle = this.color;
            context.moveTo(this.x + this.tilt + this.r / 3, this.y);
            context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
            context.stroke();
        }
    }

    function initParticles() {
        for (let i = 0; i < maxConfettis; i++) {
            particles.push(new ConfettiParticle());
        }
    }

    function updateParticles(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, W, H);
        let remainingFlakes = 0;

        particles.forEach((particle, i) => {
            particle.tiltAngle += particle.tiltAngleIncremental;
            particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
            particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

            if (particle.y <= H) remainingFlakes++;

            if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
                particle.x = Math.random() * W;
                particle.y = -30;
                particle.tilt = Math.floor(Math.random() * 10) - 20;
            }

            particle.draw(context);
        });
    }

    // Svelte lifecycle hooks
    import { onMount } from "svelte";

    onMount(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");

        canvas.width = W;
        canvas.height = H;

        initParticles();

        const animate = () => {
            updateParticles(context);
            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener("resize", () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        });
    });
</script>

<h1>Finished Game in {#if $countDown.minute} {$countDown.minute} minutes and {/if}{$countDown.second} seconds</h1>
<canvas id="canvas" style="z-index: -1;"></canvas>

<style>
    h1 {
        position: absolute;
        margin-top: 30vh;
        width: 100%;
        text-align: center;
        font-size: 333%;
        font-family: sans-serif;
        opacity: 0.7;
        top: 8vh;
        background-color: white;
        height: 30vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    canvas {
        overflow-y: hidden;
        overflow-x: hidden;
        width: 100%;
        margin: 0;
        position: absolute;
    }
</style>

const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameOver = document.querySelector('.game-over');
const btn = document.querySelector('.btn');
const start = document.querySelector('.start');
const scoreElement = document.querySelector('.score');
const maxScoreElement = document.querySelector('.max-score');
let score = 0;
let scoreComputed = 0;
let started = true;
let finished = false;
let init = false;
let maxScore = +(localStorage.getItem('marioRunMaxStore') || 0);

// Audio: Fundo
const music = new Audio('audio/runing.mp3');
// Audio: Game-over
const gameOverAudio = new Audio('audio/game-over.mp3');
// Audio: Pulo
const jumpAudio = new Audio('audio/jump.mp3');

/**
 * Ação de pulo quando o jogo foi iniciado
 * Se ainda não iniciado, inicia. 
 * Se houve game-over, reinicia.
 */
const jump = () => {
    if (!init) {
        init = true;
        mario.classList.add('mario-show');
        pipe.classList.add('pipe-run');
        start.style.opacity = 0;
        music.play();
    }

    // Se o game-over foi acionado e uma tecla pressionada, reinicia o jogo
    if (!started) {
        window.location.reload();
        return;
    }

    // Adiciona a classe de pulo apenas se o jogo está em andamento
    if (!finished && init) {
        jumpAudio.play();
        mario.classList.add('jump');

        setTimeout(() => {
            mario.classList.remove('jump');
        }, 600);
    }
}

/**
 * Adiciona zeros à esquerda de um número
 */
const completeZeros = (num, size) => {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}

/**
 * Controlador da posição do Mario em relação ao cano
 */
const loop = setInterval(() => {
    // Se houve game-over ou ainda não foi iniciado, não faz nada
    if (finished || !init) {
        return;
    }

    // Pontuação
    score++;
    scoreComputed = Math.round(score / 10);
    scoreElement.innerHTML = completeZeros(scoreComputed, 5);

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    // Situação de game over
    if (pipePosition < 120 && pipePosition > 0 && marioPosition < 100) {
        music.pause();
        gameOverAudio.play();

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = 'img/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        gameOver.style.opacity = '1';

        if (scoreComputed > maxScore) {
            maxScore = scoreComputed;
            localStorage.setItem('marioRunMaxStore', maxScore);
            maxScoreElement.innerHTML = completeZeros(maxScore, 5);
        }

        // Efeito do mário caindo
        setTimeout(() => {
            mario.classList.add('game-over-mario');
            setTimeout(() => {
                mario.style.bottom = '200px';
                setTimeout(() => {
                    mario.style.bottom = '-200px';
                    setTimeout(() => {
                        btn.style.opacity = '1';

                        // Libera a ação de reinício
                        started = false;
                    }, 300);
                }, 300);
            }, 300);
        }, 500);

        finished = true;

        clearInterval(loop);
    }
}, 10);

// Quando uma tecla é pressionada
document.addEventListener('keydown', jump);
// Quando um toque na tela é detectado
document.addEventListener('touchstart', jump);
// Quando há um click do mouse
document.addEventListener('click', jump);

// Seta pontuação máxima
maxScoreElement.innerHTML = completeZeros(maxScore, 5);
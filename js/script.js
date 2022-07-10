const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameOver = document.querySelector('.game-over');
const btn = document.querySelector('.btn');
const scoreElement = document.querySelector('.score');
let score = 0;

/**
 * Adiciona a classe .jump à imagem .mario, removendo após um tempo
 */
const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 600);
}

/**
 * Adiciona zeros à esquerda de um número
 */
 const completeZeros = (num, size) => {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}

const loop = setInterval(() => {

    score++;
    scoreElement.innerHTML = completeZeros(Math.round(score/10), 4);

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition < 120 && pipePosition > 0 && marioPosition < 100) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = 'img/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        gameOver.style.opacity = '1';
        btn.style.opacity = '1';

        clearInterval(loop);
    }

}, 10);


document.addEventListener('keydown', jump);
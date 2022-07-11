(function (d, w) {
    const board = d.querySelector('.game-board');
    const mario = d.querySelector('.mario');
    const pipe = d.querySelector('.pipe');
    const gameOver = d.querySelector('.game-over');
    const btn = d.querySelector('.btn');
    const start = d.querySelector('.start');
    const scoreElement = d.querySelector('.score');
    const maxScoreElement = d.querySelector('.max-score');
    let windowWidth = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
    let score = 0;
    let started = true;
    let finished = false;
    let init = false;
    let maxScore = +(w.localStorage.getItem('marioRunMaxStore') || 0);
    let coinIndex = 0;

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
            w.location.reload();
            return;
        }

        // Adiciona a classe de pulo apenas se o jogo está em andamento
        if (!finished && init) {
            mario.classList.add('jump');
            jumpAudio.play();

            w.setTimeout(() => {
                mario.classList.remove('jump');
            }, 700);
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
     * Retorna um número randômico entre min e max
     */
    const getRandomNumberBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Controlador da posição do Mario em relação ao cano
     */
    let qt = getRandomNumberBetween(10, 100);
    const loop = w.setInterval(() => {
        // Se houve game-over ou ainda não foi iniciado, não faz nada
        if (finished || !init) {
            return;
        }

        // Pontuação
        scoreElement.innerHTML = completeZeros(score, 5);

        const pipePosition = pipe.offsetLeft;
        const marioPosition = +w.getComputedStyle(mario).bottom.replace('px', '');

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

            // Pausando moedas
            const coins = d.querySelectorAll('.coin');
            coins.forEach((coin) => {
                coin.style.left = `${coin.offsetLeft}px`;
                coin.style.animation = 'none';
            });

            // Pontuação
            if (score > maxScore) {
                maxScore = score;
                w.localStorage.setItem('marioRunMaxStore', maxScore);
                maxScoreElement.innerHTML = completeZeros(maxScore, 5);
            }

            // Efeito do mário caindo
            w.setTimeout(() => {
                mario.classList.add('game-over-mario');
                w.setTimeout(() => {
                    mario.style.bottom = '200px';
                    w.setTimeout(() => {
                        mario.style.bottom = '-200px';
                        w.setTimeout(() => {
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

        // Criando Moedas!
        if (coinIndex >= qt) {
            qt = getRandomNumberBetween(10, 100);
            coinIndex = 0;
            const coin = d.createElement('img');
            coin.src = 'img/coin.png';
            coin.classList.add('coin');
            board.appendChild(coin);
            coin.style.bottom = (getRandomNumberBetween(1, 3) % 2 == 0) ? '200px' : '50px';
        }
        coinIndex++;

        // Controle de moedas coletadas e pontuação
        const coinElement = d.querySelector('.coin');
        if (coinElement) {
            const coinLeft = coinElement.offsetLeft;
            const coinBottom = +w.getComputedStyle(coinElement).bottom.replace('px', '');
            if (coinLeft <= 0 || (coinLeft < 120 && coinBottom > marioPosition && coinBottom < (marioPosition + 150))) {
                board.removeChild(coinElement);

                // Se não passou do mário, computa a pontuação
                if (coinLeft > 0) {
                    // Som
                    (new Audio('audio/coin.mp3')).play();
                    // Moedas altas valem 2, baixas valem 1
                    score += (coinBottom > 50) ? 2 : 1;
                }
            }
        }
    }, 10);

    // Quando uma tecla é pressionada
    d.addEventListener('keydown', jump);
    // Quando um toque na tela é detectado
    d.addEventListener('touchstart', jump);
    // Quando há um click do mouse
    d.addEventListener('click', jump);

    // Tamanho da tela
    w.addEventListener('resize', () => {
        windowWidth = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
    });

    // Seta pontuação máxima
    maxScoreElement.innerHTML = completeZeros(maxScore, 5);
})(document, window);
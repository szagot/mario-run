(function (d, w, audio, gN, yS, bS, tN, tD) {
    const board = d.querySelector('.game-board');
    const mario = d.querySelector('.mario');
    const pipe = d.querySelector('.pipe');
    const gameOver = d.querySelector('.game-over');
    const btn = d.querySelector('.btn');
    const start = d.querySelector('.start');
    const scoreElement = d.querySelector('.score');
    const maxScoreElement = d.querySelector('.max-score');
    const night = d.querySelector('.night');
    let score = 0;
    let started = true;
    let finished = false;
    let init = false;
    let maxScore = +(w.localStorage.getItem(gN) || 0);
    let coinIndex = 0;
    let jumping = false;
    let yoshi = false;
    let bowserChanging = false;
    let isNight = false;
    let ghostOver = false;

    // Audio: Fundo
    const music = audio('runing.mp3', true);
    const yoshiMusic = audio('yoshi-music.mp3', true);
    const nightMusic = audio('night.mp3', true);
    // Audio: Game-over
    const gameOverAudio = audio('game-over.mp3');
    // Audio: Pulo
    const jumpAudio = audio('jump.mp3');
    // Audio: Bowser
    const bowserAudio = audio('bowser-laugh.wav');
    // Audio: Yoshi
    const yoshiAudio = audio('yoshi.wav');
    const yoshiOffAudio = audio('yoshi-off.wav');
    // Audio em preparo que não serão usados assim
    audio('boo-coin.mp3');
    audio('yoshi-coin.mp3');
    audio('coin2.mp3');
    audio('coin.mp3');

    /**
     *  Controlando a noite e o dia
     */
    const callNight = () => {
        setTimeout(() => {
            // Prossegue apenas se o jogo estiver em execução
            if (!finished && init) {
                night.classList.add('mario-show');
                isNight = true;
                if (yoshi) {
                    yoshiMusic.pause();
                } else {
                    music.pause();
                }
                nightMusic.play();

                setTimeout(() => {
                    // Prossegue apenas se o jogo estiver em execução
                    if (!finished && init) {
                        night.classList.remove('mario-show');
                        isNight = false;
                        nightMusic.pause();
                        if (yoshi) {
                            yoshiMusic.play();
                        } else {
                            music.play();
                        }

                        callNight();
                    }
                }, tD);
            }
        }, tN);
    }

    /**
     * Ação de pulo quando o jogo foi iniciado
     * Se ainda não iniciado, inicia. 
     * Se houve game-over, reinicia.
     */
    const jump = () => {
        if (jumping) {
            return;
        }

        if (!init) {
            init = true;
            mario.classList.add('mario-show');
            pipe.classList.add('pipe-run');
            start.style.opacity = 0;
            music.play();
            callNight();
        }

        // Se o game-over foi acionado e uma tecla pressionada, reinicia o jogo
        if (!started) {
            w.location.reload();
            return;
        }

        // Adiciona a classe de pulo apenas se o jogo está em andamento
        if (!finished && init) {
            jumping = true;
            mario.classList.add('jump');
            jumpAudio.play();

            w.setTimeout(() => {
                mario.classList.remove('jump');
                jumping = false;
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
     * Retorna um número randômico entre min e max
     */
    const getRandomNumberBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Troca o personagem (Mario monta no Yoshi ou desmonta)
     */
    const yoshiToogle = () => {
        mario.src = yoshi ? 'img/mario.gif' : 'img/mario-yoshi.gif';
        yoshi = !yoshi;
        if (yoshi) {
            if (isNight) {
                nightMusic.pause();
            } else {
                music.pause();
            }
            yoshiAudio.play();
            yoshiMusic.play();
        } else {
            yoshiMusic.pause();
            yoshiOffAudio.play();
            if (isNight) {
                nightMusic.play();
            } else {
                music.play();
            }
        }
    }

    /**
     * Troca o inimigo (Cano ou Bowser)
     */
    const bowser = () => {
        // Bowser não aparece a noite
        if (isNight) {
            return;
        }

        bowserAudio.play();
        pipe.src = 'img/bowser.gif';
        pipe.classList.remove('pipe-run');
        pipe.style.right = '-100px';
        pipe.style.bottom = '10px';
        setTimeout(() => {
            pipe.classList.add('bowser-run');
            setTimeout(() => {
                if (!finished) {
                    pipe.src = 'img/pipe.png';
                    pipe.style.right = '-100px';
                    pipe.style.bottom = '0px';
                    pipe.classList.remove('bowser-run');
                    setTimeout(() => {
                        pipe.classList.add('pipe-run');
                        bowserChanging = false;
                    }, 100);
                }
            }, 1000);
        }, 1000);
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
        scoreElement.innerHTML = completeZeros(score, 4);

        let pipePosition = pipe.offsetLeft;
        const marioPosition = +w.getComputedStyle(mario).bottom.replace('px', '');

        // Situação de game over
        if ((pipePosition < 120 && pipePosition > 0 && marioPosition < 100) || ghostOver) {
            // Tá com o Yoshi?
            if (yoshi && !ghostOver) {
                // Perde o Yoshi
                yoshiToogle();

                // Remove obstáculos para não dar game-over do mesmo jeito
                pipe.classList.remove('pipe-run');
                pipe.style.left = '-100px';
                pipePosition = -100;
                pipe.src = 'img/pipe.png';
                // Recoloca obstáculos
                setTimeout(() => {
                    pipe.style.right = '-100px';
                    pipe.style.left = 'auto';
                    setTimeout(() => {
                        pipe.classList.add('pipe-run');
                    }, 1000);
                }, 500);
            } else {
                // Game Over
                music.pause();
                nightMusic.pause();
                yoshiMusic.pause();
                gameOverAudio.play();

                pipe.classList.remove('pipe-run');
                pipe.style.left = `${pipePosition}px`;

                mario.classList.remove('jump');
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

                // Pausando ovos
                const egg = d.querySelector('.egg');
                if (egg) {
                    egg.style.left = `${egg.offsetLeft}px`;
                    egg.style.animation = 'none';
                }

                // Pontuação
                if (score > maxScore) {
                    maxScore = score;
                    w.localStorage.setItem(gN, maxScore);
                    maxScoreElement.innerHTML = completeZeros(maxScore, 4);
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

                w.clearInterval(loop);
            }
        }

        // Criando Moedas! (ou fantasmas, ovos, etc...)
        if (coinIndex >= qt && !finished && init) {
            qt = getRandomNumberBetween(10, isNight ? 300 : 80);
            coinIndex = 0;
            const coin = d.createElement('img');
            coin.src = 'img/coin.png';
            coin.classList.add('coin');
            const isBetter = getRandomNumberBetween(1, 3) % 2 == 0;
            coin.style.bottom = isBetter ? '200px' : '50px';
            if (isBetter && qt > 90 && !isNight) {
                coin.src = 'img/yoshi-coin.gif';
                coin.classList.add('yoshi-coin');
            }
            if (isNight) {
                coin.src = 'img/boo.gif';
                coin.classList.add('boo-coin');
            }
            board.appendChild(coin);
        }
        coinIndex++;

        // Controle de moedas coletadas e pontuação
        const coinElement = d.querySelector('.coin');
        if (coinElement) {
            const coinLeft = coinElement.offsetLeft;
            const coinBottom = +w.getComputedStyle(coinElement).bottom.replace('px', '');
            const isyoshiCoin = coinElement.classList.contains("yoshi-coin");
            const isBoo = coinElement.classList.contains('boo-coin');
            if (coinLeft <= 0 || (coinLeft < 130 && coinBottom > marioPosition && coinBottom < (marioPosition + 120))) {
                board.removeChild(coinElement);

                // Se não passou do mário, computa a pontuação
                if (coinLeft > 0) {
                    let coinBetter = (coinBottom > 50);
                    // Som
                    (audio(isBoo ? 'boo-coin.mp3' : (isyoshiCoin ? 'yoshi-coin.mp3' : (coinBetter ? 'coin2.mp3' : 'coin.mp3')))).play();
                    // Se for noite, tira pontos
                    if (isBoo) {
                        score--;
                        if (score <= 0) {
                            ghostOver = true;
                        } else if (yoshi) {
                            // Se tiver o Yoshi e tocar no fantasma, perde o Yoshi
                            yoshiToogle();
                        }

                    } else {
                        // Moedas altas valem 2, baixas valem 1. Se for uma Yoshi Coin, vale 5.
                        score += isyoshiCoin ? 5 : (coinBetter ? 2 : 1);
                        // Bonus por ter pego o yoshi
                        if (yoshi) {
                            score += isyoshiCoin ? 5 : (coinBetter ? 2 : 1);
                        }
                    }
                }
            }
        }

        // Criando ovo do Yoshi se não for de noite
        let eggElement = d.querySelector('.egg');
        if (!isNight && !eggElement && !yoshi && score > 0 && (score % yS == 0 || (score + 1) % yS == 0)) {
            const egg = d.createElement('img');
            egg.src = 'img/egg-yoshi.gif';
            egg.classList.add('egg');
            board.appendChild(egg);
        }

        // Controle de ovo coletadas e pontuação
        eggElement = d.querySelector('.egg');
        if (eggElement) {
            const eggLeft = eggElement.offsetLeft;
            const eggBottom = +w.getComputedStyle(eggElement).bottom.replace('px', '');
            if (eggLeft <= 0 || (eggLeft < 130 && eggBottom > marioPosition && eggBottom < (marioPosition + 120))) {
                board.removeChild(eggElement);

                // Pegou o ovo?
                if (eggLeft > 0) {
                    yoshiToogle();
                }
            }
        }

        // Trocando pipe pelo bowser
        if (score % bS == 0 && score > 0 && !bowserChanging) {
            bowserChanging = true;
            const changeBowser = setInterval(() => {
                if (pipe.offsetLeft <= -80) {
                    bowser();
                    w.clearInterval(changeBowser);
                }
            }, 1);
        }

    }, 10);

    // Quando uma tecla é pressionada
    d.addEventListener('keydown', jump);
    // Quando um toque na tela é detectado
    d.addEventListener('touchstart', jump);
    // Quando há um click do mouse
    d.addEventListener('click', jump);

    // Seta pontuação máxima
    maxScoreElement.innerHTML = completeZeros(maxScore, 4);
})(document, window, prepareAudio, gameName, yoshiScore, bowserScore, turnNight, turnDay);
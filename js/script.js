/**
 * By SzagOt 
 * Daniel Bispo <szagot@gmail.com>
 * 2022
 */
(function (d, w, audio, gN, yS, bS, tN, tD, minG, maxG, maxGN) {
    const board = d.querySelector('.game-board');
    const mario = d.querySelector('.mario');
    const pipe = d.querySelector('.pipe');
    const gameOver = d.querySelector('.game-over');
    const btn = d.querySelector('.btn');
    const start = d.querySelector('.start');
    const scoreElement = d.querySelector('.score');
    const maxScoreElement = d.querySelector('.max-score');
    const clouds = d.querySelector('.clouds');
    const night = d.querySelector('.night');
    let loop;
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
    let nightStarted;
    let dayStarted;
    let ghostOver = false;
    let yesNo = true;

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
     * Limpa a tela pra reiniciar o jogo
     */
    const clearScreen = () => {
        // Noite
        night.classList.remove('mario-show');
        isNight = false;
        yesNo = true;

        // Músicas
        music.pause();
        nightMusic.pause();
        yoshiMusic.pause();

        // Mário
        bowserChanging = false;
        mario.classList.remove('mario-show');
        w.setTimeout(() => {
            mario.src = 'img/mario.gif';
            mario.classList.remove('over');
            mario.classList.remove('game-over-mario');
            mario.style.bottom = '0';
        }, 300);

        // Cano
        pipe.src = 'img/pipe.png';
        pipe.style.left = 'auto';
        pipe.style.right = '-160px';
        pipe.style.bottom = '0';
        pipe.classList.remove('pipe-run');
        pipe.classList.remove('bowser-run');

        // Moedas
        const coins = d.querySelectorAll('.coin');
        coins.forEach((coin) => {
            board.removeChild(coin);
        });

        // Ovo
        const eggElement = d.querySelector('.egg');
        if (eggElement) {
            board.removeChild(eggElement);
        }

        // Tela
        gameOver.style.opacity = '0';
        btn.style.zIndex = '998';
        btn.style.opacity = '0';
        start.style.zIndex = '999';
        start.style.opacity = '1';

        init = false;
        finished = false;
        started = true;
        score = 0;
        scoreElement.innerHTML = '0000';

        if (nightStarted) {
            w.clearInterval(nightStarted);
        }
        if (dayStarted) {
            w.clearInterval(dayStarted);
        }
        if (loop) {
            clearInterval(loop);
        }

        startGame();
    };

    /**
     *  Controlando a noite e o dia
     */
    const callNight = () => {
        nightStarted = w.setInterval(() => {
            // Prossegue apenas se o jogo estiver em execução
            if (!finished && init) {
                night.classList.add('mario-show');
                clouds.classList.add('shadow');
                pipe.style.opacity = '0';
                isNight = true;
                w.setTimeout(() => {
                    pipe.classList.remove('pipe-run');
                    pipe.style.right = '70%';
                }, 1000)
                if (yoshi) {
                    yoshiMusic.pause();
                } else {
                    music.pause();
                }
                nightMusic.play();

                dayStarted = w.setInterval(() => {
                    // Prossegue apenas se o jogo estiver em execução
                    if (!finished && init) {
                        night.classList.remove('mario-show');
                        clouds.classList.remove('shadow');
                        pipe.style.right = '-160px';
                        pipe.style.opacity = '1';
                        w.setTimeout(() => {
                            pipe.classList.add('pipe-run');
                        }, 1000);
                        isNight = false;
                        nightMusic.pause();
                        if (yoshi) {
                            yoshiMusic.play();
                        } else {
                            music.play();
                        }

                        callNight();
                    }

                    w.clearInterval(dayStarted);
                }, tD);

                w.clearInterval(nightStarted);
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
            clearScreen();
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
        if (isNight || bowserChanging) {
            return;
        }
        bowserChanging = true;

        bowserAudio.play();
        pipe.src = 'img/bowser.gif';
        pipe.classList.remove('pipe-run');
        pipe.style.right = '-160px';
        pipe.style.bottom = '10px';
        w.setTimeout(() => {
            pipe.classList.add('bowser-run');
            w.setTimeout(() => {
                if (!finished) {
                    pipe.src = 'img/pipe.png';
                    pipe.classList.remove('bowser-run');
                    pipe.style.right = '-160px';
                    pipe.style.bottom = '0px';
                    w.setTimeout(() => {
                        bowserChanging = false;
                        pipe.classList.add('pipe-run');
                    }, 1200);
                }
            }, 1000);
        }, 1000);
    }

    /**
     * Controlador da posição do Mario em relação ao cano
     */
    const startGame = () => {
        let qt = getRandomNumberBetween(minG, maxG);
        loop = w.setInterval(() => {
            // Se houve game-over ou ainda não foi iniciado, não faz nada
            if (finished || !init) {
                return;
            }

            // Pontuação
            scoreElement.innerHTML = completeZeros(score, 4);

            // Posições
            let pipePosition = pipe.offsetLeft;
            const marioPosition = +w.getComputedStyle(mario).bottom.replace('px', '');
            var screenWidth = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;

            // Situação de game over
            if ((!isNight && pipePosition < 120 && pipePosition > 0 && marioPosition < 100) || ghostOver) {
                // Tá com o Yoshi?
                if (yoshi && !ghostOver) {
                    // Perde o Yoshi
                    yoshiToogle();

                    // Remove obstáculos para não dar game-over do mesmo jeito
                    pipe.classList.remove('pipe-run');
                    pipe.style.left = '-160px';
                    pipePosition = -160;
                    pipe.src = 'img/pipe.png';
                    // Recoloca obstáculos
                    w.setTimeout(() => {
                        pipe.style.right = '-160px';
                        pipe.style.left = 'auto';
                        w.setTimeout(() => {
                            if (!bowserChanging) {
                                pipe.classList.add('pipe-run');
                            }
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
                    mario.classList.add('over');

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
                                    btn.style.zIndex = '999';
                                    start.style.zIndex = '998';

                                    // Libera a ação de reinício
                                    started = false;
                                }, 300);
                            }, 300);
                        }, 300);
                    }, 500);

                    finished = true;

                    if (nightStarted) {
                        w.clearInterval(nightStarted);
                    }
                    if (dayStarted) {
                        w.clearInterval(dayStarted);
                    }

                    w.clearInterval(loop);
                }
            }

            // Criando Moedas! (ou fantasmas, ovos, etc...)
            if (coinIndex >= qt && !finished && init && pipePosition > screenWidth * .1 && pipePosition < screenWidth * .8) {
                qt = getRandomNumberBetween(minG, isNight ? maxGN : maxG);
                coinIndex = 0;
                const coin = d.createElement('img');
                coin.src = 'img/coin.png';
                coin.classList.add('coin');
                const isBetter = getRandomNumberBetween(1, 3) % 2 == 0;
                coin.style.bottom = isBetter ? '200px' : '50px';
                // Verificando se já tem uma moeda Yoshi na tela antes de trocar
                const hasYoshi = d.querySelector('.yoshi-coin');
                if (!hasYoshi && isBetter && !isNight && qt > (maxG / 2) && pipePosition > screenWidth * .3 && pipePosition < screenWidth * .6) {
                    coin.src = 'img/yoshi-coin.gif';
                    coin.classList.add('yoshi-coin');
                }
                if (isNight) {
                    coin.src = 'img/boo.gif';
                    coin.classList.add('boo-coin');
                }
                // Se for de noite só adiciona metade da quantidade de fantasmas
                if (!isNight || yesNo) {
                    board.appendChild(coin);
                }
                yesNo = !yesNo;
            }
            coinIndex++;

            // Controle de moedas coletadas e pontuação
            const verifyGetCoin = function (coinElement) {
                const coinLeft = coinElement.offsetLeft;
                const coinBottom = +w.getComputedStyle(coinElement).bottom.replace('px', '');
                const isyoshiCoin = coinElement.classList.contains("yoshi-coin");
                const isBoo = coinElement.classList.contains('boo-coin');
                if (coinLeft <= -70 || (coinLeft < 130 && coinLeft > 5 && coinBottom > marioPosition && coinBottom < (marioPosition + 120))) {
                    board.removeChild(coinElement);

                    // Se não passou do mário, computa a pontuação
                    if (coinLeft > 5) {
                        let coinBetter = (coinBottom > 50);
                        // Som
                        (audio(isBoo ? 'boo-coin.mp3' : (isyoshiCoin ? 'yoshi-coin.mp3' : (coinBetter ? 'coin2.mp3' : 'coin.mp3')))).play();
                        // Se for noite, tira pontos
                        if (isBoo) {
                            score -= yoshi ? 1 : 2;
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
            const coinElements = d.querySelectorAll('.coin');
            if (coinElements[0]) verifyGetCoin(coinElements[0]);
            // Repeteco se faz necessário para o caso de não ter coletado o elemento 0 e o elemento 1 sim
            if (coinElements[1]) verifyGetCoin(coinElements[1]);

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
            if ((score % bS == 0 || (score + 1) % bS == 0) && score > 10 && pipe.offsetLeft <= -80) {
                bowser();
            }

        }, 10);
    }

    // Quando uma tecla é pressionada
    d.addEventListener('keydown', jump);
    // Quando um toque na tela é detectado
    board.addEventListener('touchstart', jump);

    // Seta pontuação máxima
    maxScoreElement.innerHTML = completeZeros(maxScore, 4);

    // Botões
    maxScoreElement.addEventListener('click', () => {
        if (!started || !init) {
            score = 0;
            maxScore = 0;
            w.localStorage.setItem(gN, maxScore);
            scoreElement.innerHTML = '0000';
            maxScoreElement.innerHTML = '0000';

            clearScreen();
        } else {
            return false;
        }
    })
    btn.addEventListener('click', () => {
        // Reinicia apenas se a opacidade estiver ativa
        if (btn.style.opacity * 1 === 1) {
            clearScreen();
        }
    });
    start.addEventListener('click', jump);

    startGame();

})(document, window, prepareAudio, gameName, yoshiScore, bowserScore, turnNight, turnDay, minGen, maxGen, maxGenNight);
/**
 * By SzagOt 
 * Daniel Bispo <szagot@gmail.com>
 * 2022
 */
(function (gameName, yoshiScore, d, w) {
    /**
     * Inicializa um audio
     */
    const audio = (file, vol) => {
        const audioFile = new Audio(file);
        audioFile.volume = vol;
        audioFile.preload = 'auto';
        return audioFile;
    }

    /**
     * Precarga de áudio
     */
    const vol = 1;
    const volBack = 0.7;
    const runing = audio('audio/runing.mp3', volBack);
    const runingYoshi = audio('audio/yoshi-music.mp3', volBack);
    const runingNight = audio('audio/night.mp3', volBack);
    const jump = audio('audio/jump.mp3', vol);
    const gameOver = audio('audio/game-over.mp3', volBack);
    const bowserLaugh = audio('audio/bowser-laugh.wav', vol);
    const yoshi = audio('audio/yoshi.wav', vol);
    const yoshiOff = audio('audio/yoshi-off.wav', vol);
    const coin = audio('audio/coin.mp3', vol);
    const coinHigh = audio('audio/coin2.mp3', vol);
    const coinBoo = audio('audio/boo-coin.mp3', vol);
    const coinYoshi = audio('audio/yoshi-coin.mp3', vol);


    class Stats {
        constructor(element, audioFile = null, audioLooping = false, visible = true) {
            this.element = d.querySelector(element);
            this.audio = audioFile ? audioFile : null;
            this.audioLooping = audioLooping;
            this.visible = visible;
            this.isPlaing = false;
            this.calcMaths();
            this.visible ? this.show() : this.hide();
            if (this.audioLooping && this.audio) {
                if (typeof this.audio.loop == 'boolean') {
                    this.audio.loop = true;
                }
                else {
                    this.audio.addEventListener('ended', function () {
                        this.currentTime = 0;
                        this.play();
                    }, false);
                }
            }
        }

        // Calula medidas
        calcMaths() {
            this.left = this.element.offsetLeft;
            this.right = +w.getComputedStyle(this.element).right.replace('px', '');
            this.bottom = +w.getComputedStyle(this.element).bottom.replace('px', '');
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
        }

        // Play no audio
        playAudio() {
            // Se não tiver audio ou se tiver, mas for looping e já estiver tocando, não faz nada
            if (!this.audio || (this.audioLooping && this.isPlaing)) {
                return;
            }

            if (this.isPlaing) {
                this.stopAudio();
            }

            this.audio.play();
            this.isPlaing = true;
        }

        // Stop/Pause no audio
        stopAudio(reset = true) {
            if (this.isPlaing) {
                this.isPlaing = false;
                this.audio.pause();
                if (reset) {
                    this.audio.currentTime = 0;
                }
            }
        }

        // Hide Element
        hide() {
            this.element.style.opacity = '0';
            this.visible = false;
        }

        // Show Element
        show() {
            this.element.style.opacity = '1';
            this.visible = true;
        }
    };

    class BoardStats extends Stats {
        constructor() {
            super('.game-board', runing, true);
            this.scoreElement = d.querySelector('.score');
            this.maxScoreElement = d.querySelector('.max-score');
            this.score = 0;
            this.maxScore = 0;
            this.isNight = false;
            this.started = false;
            this.isGameOver = false;
            this.persistScores();
            this.generateCoinRandom();
        }

        start() {
            if (this.isGameOver) {
                return;
            }
            this.started = true;
            this.clearCoins();
            d.querySelector('.start').style.opacity = '0';
            d.querySelector('.game-over').style.opacity = '0';
            d.querySelector('.btn').style.opacity = '0';
        }

        gameOver() {
            this.started = false;
            this.isGameOver = true;
            this.persistScores();
            this.stopCoins();
            d.querySelector('.game-over').style.opacity = '1';
            setTimeout(() => {
                d.querySelector('.btn').style.opacity = '1';
                setTimeout(() => {
                    this.isGameOver = false;
                }, 1000);
            }, 1000);
        }

        /**
         * Gera um novo número pra o controle de moedas
         */
        generateCoinRandom() {
            this.minG = 10;
            this.maxG = this.isNight ? 80 : 50;
            this.coinRandom = this.getRandomNumberBetween(this.minG, this.maxG);
            this.coinIndex = 0;
            this.ghostPermit = true;
        }

        /**
         * Adiciona zeros à esquerda de um número
         */
        completeZeros(num, size) {
            var s = num + '';
            while (s.length < size) s = '0' + s;
            return s;
        }

        /**
         * Retorna um número randômico entre min e max
         */
        getRandomNumberBetween(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        /**
         * Soma pontuação
         */
        sumScore(score = 1, isGhost = false) {
            if (isGhost) {
                this.score -= score;
            } else {
                this.score += score;
            }
            if (this.maxScore < this.score)
                this.maxScore = this.score;
            this.scoreElement.innerHTML = this.completeZeros(this.score, 4);
        }

        /**
         * Grava pontuação máxima
         */
        persistScores() {
            const actualMaxScores = w.localStorage.getItem('maxScores') || 0;
            if (this.maxScore > actualMaxScores)
                w.localStorage.setItem('maxScores', this.maxScore);
            else
                this.maxScore = actualMaxScores;

            this.maxScoreElement.innerHTML = this.completeZeros(this.maxScore, 4);
        }

        /**
         * Objeto PipeStats
         * @param {MarioStats} mario 
         * @param {PipeStats} pipe 
         */
        coinControl(mario, pipe) {
            this.coinIndex++;
            if (this.coinIndex >= this.coinRandom && this.started && pipe.left > this.width * .1 && pipe.left < this.width * .8) {
                this.generateCoinRandom();
                const isBetter = this.getRandomNumberBetween(1, 3) % 2 == 0;
                // Verificando se já tem uma moeda Yoshi na tela antes de trocar
                const hasYoshi = d.querySelector('.yoshi-coin');
                const coin = d.createElement('img');
                coin.src = 'img/coin.png';
                coin.classList.add('coin');
                coin.style.bottom = isBetter ? '200px' : '50px';

                if (!hasYoshi && isBetter && !this.isNight && this.coinRandom > (this.maxG / 2) && pipe.left > this.width * .3 && pipe.left < this.width * .6) {
                    coin.src = 'img/yoshi-coin.gif';
                    coin.classList.add('yoshi-coin');
                }
                if (this.isNight) {
                    coin.src = 'img/boo.gif';
                    coin.classList.add('boo-coin');
                }
                // Se for de noite só adiciona metade da quantidade de fantasmas
                if (!this.isNight || this.ghostPermit) {
                    this.element.appendChild(coin);
                }
                this.ghostPermit = !this.ghostPermit;
            }

            // Validando se o Mário pegou o item
            const coinElement = d.querySelectorAll('.coin');
            this.verifyGetCoin(coinElement[0], mario);
            // Isso se faz necessário por que as vezes o segundo item alcansou o Mario, 
            // mas o primeiro ainda não foi eliminado
            this.verifyGetCoin(coinElement[1], mario);

            // Criando ovo do Yoshi se não for de noite
            let eggElement = d.querySelector('.egg');
            if (!this.isNight && !eggElement && !mario.isYoshi && this.score > 0 && (this.score % yoshiScore == 0 || (this.score + 1) % yoshiScore == 0)) {
                const egg = d.createElement('img');
                egg.src = 'img/egg-yoshi.gif';
                egg.classList.add('egg');
                this.element.appendChild(egg);
            }

            // Controle de ovo coletadas e pontuação
            eggElement = d.querySelector('.egg');
            if (eggElement) {
                const eggLeft = eggElement.offsetLeft;
                const eggBottom = +w.getComputedStyle(eggElement).bottom.replace('px', '');
                if (eggLeft <= 5 || (eggLeft < 130 && eggBottom > mario.bottom && eggBottom < (mario.bottom + 120))) {
                    this.element.removeChild(eggElement);

                    // Pegou o ovo?
                    if (eggLeft > 5) {
                        mario.yoshiToogle();
                    }
                }
            }
        }

        /**
         * Verifica se o mario pegou o item
         */
        verifyGetCoin(coinElement, mario) {
            if (coinElement) {
                const coinLeft = coinElement.offsetLeft;
                const coinBottom = +w.getComputedStyle(coinElement).bottom.replace('px', '');
                const isYoshiCoin = coinElement.classList.contains("yoshi-coin");
                const isBoo = coinElement.classList.contains('boo-coin');
                let coinBetter = (coinBottom > 50);
                if (coinLeft < -70 || (coinLeft < 130 && coinLeft > 5 && coinBottom > mario.bottom && coinBottom < (mario.bottom + 120))) {
                    this.element.removeChild(coinElement);

                    // Mario pegou?
                    if (coinLeft > 5) {
                        (isBoo ? coinBoo : (isYoshiCoin ? coinYoshi : (coinBetter ? coinHigh : coin))).cloneNode().play();

                        // Se for fantasma, tira pontos
                        if (isBoo) {
                            this.sumScore(yoshi ? 1 : 2, true);
                            if (this.score <= 0) {
                                // TODO: GameOver por fantasma
                                // ghostOver = true;
                            } else if (yoshi) {
                                // Se tiver o Yoshi e tocar no fantasma, perde o Yoshi
                                mario.yoshiToogle();
                            }

                        } else {
                            // Moedas altas valem 2, baixas valem 1. Se for uma Yoshi Coin, vale 5.
                            this.sumScore(isYoshiCoin ? 5 : (coinBetter ? 2 : 1));
                            // Bonus por ter pego o yoshi
                            if (yoshi) {
                                this.sumScore(isYoshiCoin ? 5 : (coinBetter ? 2 : 1));
                            }
                        }
                    }
                }
            }
        }

        stopCoins() {
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
        }

        clearCoins() {
            const coins = d.querySelectorAll('.coin');
            coins.forEach((coin) => {
                this.element.removeChild(coin);
            });
            const eggs = d.querySelectorAll('.egg');
            eggs.forEach((egg) => {
                this.element.removeChild(egg);
            });
        }
    }

    class MarioStats extends Stats {
        constructor() {
            super('.mario', jump, false, false);
            this.isYoshi = false;
        }

        jump() {
            if (this.element.classList.contains('jump')) {
                return;
            }

            this.playAudio();
            this.element.classList.add('jump');
            w.setTimeout(() => this.element.classList.remove('jump'), 600);
        }

        gameOver() {
            this.element.src = 'img/game-over.png';
            this.calcMaths();
            this.element.style.bottom = this.bottom + 'px';
            this.element.classList.remove('jump');
            gameOver.play();
            this.element.classList.add('over');
            w.setTimeout(() => {
                this.element.style.bottom = '200px';

                w.setTimeout(() => {
                    this.element.style.bottom = '-200px';

                    w.setTimeout(() => {
                        board.gameOver();
                        this.restart();
                    }, 300);
                }, 300);
            }, 800);
        }

        restart() {
            this.hide();
            this.element.src = 'img/mario.gif';
            this.element.classList.remove('over');
        }

        show() {
            this.element.style.bottom = '0';
            this.element.style.opacity = '1';
            this.visible = true;
        }

        // TODO
        yoshiToogle(board) {
            this.element.src = this.isYoshi ? 'img/mario.gif' : 'img/mario-yoshi.gif';
            this.isYoshi = !this.isYoshi;
            if (this.isYoshi) {
                if (board.isNight) {
                    runingNight.pause();
                } else {
                    runing.pause();
                }
                yoshi.play();
                runingYoshi.play();
            } else {
                runingYoshi.pause();
                yoshiOff.play();
                if (isNight) {
                    runingNight.play();
                } else {
                    runing.play();
                }
            }
        }
    }

    class PipeStats extends Stats {
        constructor() {
            super('.pipe', null, false, false);
        }

        run() {
            if (this.element.classList.contains('pipe-run')) {
                return;
            }

            this.element.style.right = '-80px;';
            if (!this.visible)
                this.show();
            this.element.classList.add('pipe-run');
        }

        stop() {
            this.calcMaths();
            this.element.classList.remove('pipe-run');
            this.element.style.right = this.right + 'px';
        }
    }

    /**
     * Variáveis de baase
     */
    const board = new BoardStats();
    const mario = new MarioStats();
    const pipe = new PipeStats();
    const preStart = () => {
        // Se já iniciou, executa o pulo, senão inicia
        board.started ? mario.jump() : start(board, mario, pipe);
    }

    /**
     * Start do Game
     * @returns 
     */
    const start = (board, mario, pipe) => {
        if (board.started || board.isGameOver) {
            return;
        }

        board.playAudio();
        mario.show();
        pipe.run();
        board.start();

        const loop = w.setInterval(() => {
            // Recalcula medidas e posições
            board.calcMaths();
            pipe.calcMaths();
            mario.calcMaths();
            board.coinControl(mario, pipe);

            // Game over?
            if (pipe.left < 120 && mario.bottom < 100 && pipe.left > 10) {
                pipe.stop();
                board.stopAudio();
                mario.gameOver();
                board.gameOver();
                clearInterval(loop);
            }
        }, 10);
    }

    /**
     * Listeners
     */
    window.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'ArrowUp') {
            preStart();
        }
    });
    window.addEventListener('touchstart', () => {
        preStart();
    });

})('marioRunGost', 35, document, window);
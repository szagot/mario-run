/**
 * By SzagOt 
 * Daniel Bispo <szagot@gmail.com>
 * 2022
 */
(function (gameName, d, w) {
    /**
     * Precarga de áudio
     */
     const runing = new Audio('audio/runing.mp3');
     const runingYoshi = (new Audio('audio/yoshi-music.mp3'));
     const nightRuning = (new Audio('audio/night.mp3'));
     const jump = (new Audio('audio/jump.mp3'));
     const gameOver = (new Audio('audio/game-over.mp3'));
     const bowserLaugh = (new Audio('audio/bowser-laugh.wav'));
     const yoshi = (new Audio('audio/yoshi.wav'));
     const yoshiOff = (new Audio('audio/yoshi-off.wav'));
     const coin = (new Audio('audio/coin2.mp3'));
     const coinHigh = (new Audio('audio/coin.mp3'));
     const coinBoo = (new Audio('audio/boo-coin.mp3'));
     const coinYoshi = (new Audio('audio/yoshi-coin.mp3'));
     const volback = 0.7;
     runing.volume = volback;
     nightRuning.volume = volback;
     runingYoshi.volume = volback;
     gameOver.volume = volback;

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
        }
    }

    class MarioStats extends Stats {
        constructor() {
            super('.mario', jump, false, false);
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
                        started = false;
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
     * Start do Game
     * @returns 
     */
    const start = (board, mario, pipe) => {
        if (started) {
            return;
        }

        board.playAudio();
        mario.show();
        pipe.run();
        started = true;

        const loop = w.setInterval(() => {
            // Recalcula medidas e posições
            board.calcMaths();
            pipe.calcMaths();
            mario.calcMaths();

            // Game over?
            if (pipe.left < 120 && mario.bottom < 100 && pipe.left > 10) {
                pipe.stop();
                board.stopAudio();
                mario.gameOver();
                clearInterval(loop);
            }
        }, 10);
    }

    /**
     * Variáveis de baase
     */
    let started = false;
    const board = new BoardStats();
    const mario = new MarioStats();
    const pipe = new PipeStats();
    const preStart = () => {
        // Se já iniciou, executa o pulo, senão inicia
        started ? mario.jump() : start(board, mario, pipe);
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

})('marioRunGost', document, window);
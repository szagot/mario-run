/**
 * By SzagOt 
 * Daniel Bispo <szagot@gmail.com>
 * 2022
 */
(function (gameName, d, w) {
    class Stats {
        constructor(element, audioFile = null, audioLooping = false, visible = true) {
            this.element = d.querySelector(element);
            this.audio = audioFile ? new Audio('audio/' + audioFile) : null;
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
     * Tabuleiro
     * @return {Stats}
     */
    const getBoard = () => {
        const stats = new Stats('.game-board', 'runing.mp3', true);

        return stats;
    }

    /**
     * Mario
     * @return {Stats}
     */
    const getMario = () => {
        const stats = new Stats('.mario', 'jump.mp3', false, false);

        return stats;
    }

    const board = getBoard();
    const mario = getMario();

    console.log(board);
    console.log(mario);

    window.addEventListener('resize', () => {
        board.calcMaths();
        console.log(board);
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'ArrowUp') {
            mario.playAudio();
            board.playAudio();
        }
    });

    // // Audio: Fundo
    // const yoshiMusic = audio('yoshi-music.mp3', true);
    // const nightMusic = audio('night.mp3', true);
    // // Audio: Game-over
    // const gameOverAudio = audio('game-over.mp3');
    // // Audio: Bowser
    // const bowserAudio = audio('bowser-laugh.wav');
    // // Audio: Yoshi
    // const yoshiAudio = audio('yoshi.wav');
    // const yoshiOffAudio = audio('yoshi-off.wav');

    // // Audio em preparo que não serão usados assim
    // audio('boo-coin.mp3');
    // audio('yoshi-coin.mp3');
    // audio('coin2.mp3');
    // audio('coin.mp3');


})('marioRunGost', document, window);
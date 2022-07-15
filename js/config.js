/**
 * By SzagOt 
 * Daniel Bispo <szagot@gmail.com>
 * 2022
 */

// O nome define a base de pontuação máxima
const gameName = 'marioRunGost';
// A cada quantos pontos o Yoshi ficará disponível
const yoshiScore = 35;
// A cada quantos pontos o inimigo será o bowser?
const bowserScore = 20;
// Após quantos segundos fica de noite? E de dia?
const turnNight = 25000;
const turnDay = 15000;
// Geração de objetos
const minGen = 10;
const maxGen = 50;
const maxGenNight = 100;

/**
 * Prepara um áudio para ser executado
 * 
 * @param {string} file Somente o nome do arquivo
 * @param {boolean} isLoop É pra rodar em loop?
 */
const prepareAudio = (file, isLoop) => {
    audio = new Audio('audio/' + file);

    if (isLoop) {
        if (typeof audio.loop == 'boolean') {
            audio.loop = true;
        }
        else {
            audio.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
    }

    return audio;
}

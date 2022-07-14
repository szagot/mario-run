/**
 * By SzagOt 
 * Daniel Bispo <szagot@gmail.com>
 * 2022
 */
const gameName="marioRunGost",yoshiScore=35,bowserScore=20,turnNight=3e4,turnDay=2e4,prepareAudio=(o,e)=>(audio=new Audio("audio/"+o),e&&("boolean"==typeof audio.loop?audio.loop=!0:audio.addEventListener("ended",(function(){this.currentTime=0,this.play()}),!1)),audio);
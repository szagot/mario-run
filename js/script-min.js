!function(e,t,s,o,i,r,a,l,c,n,p){const m=e.querySelector(".game-board"),y=e.querySelector(".mario"),u=e.querySelector(".pipe"),g=e.querySelector(".game-over"),d=e.querySelector(".btn"),f=e.querySelector(".start"),L=e.querySelector(".score"),v=e.querySelector(".max-score"),h=e.querySelector(".night");let x,b,S,T=0,I=!0,q=!1,w=!1,E=+(t.localStorage.getItem(o)||0),C=0,M=!1,H=!1,j=!1,k=!1,z=!1,A=!0;const $=s("runing.mp3",!0),G=s("yoshi-music.mp3",!0),N=s("night.mp3",!0),W=s("game-over.mp3"),D=s("jump.mp3"),B=s("bowser-laugh.wav"),F=s("yoshi.wav"),J=s("yoshi-off.wav");s("boo-coin.mp3"),s("yoshi-coin.mp3"),s("coin2.mp3"),s("coin.mp3");const K=()=>{h.classList.remove("mario-show"),k=!1,A=!0,$.pause(),N.pause(),G.pause(),j=!1,y.classList.remove("mario-show"),t.setTimeout((()=>{y.src="img/mario.gif",y.classList.remove("over"),y.classList.remove("game-over-mario"),y.style.bottom="0"}),300),u.src="img/pipe.png",u.style.left="auto",u.style.right="-160px",u.style.bottom="0",u.classList.remove("pipe-run"),u.classList.remove("bowser-run");e.querySelectorAll(".coin").forEach((e=>{m.removeChild(e)}));const s=e.querySelector(".egg");s&&m.removeChild(s),g.style.opacity="0",d.style.zIndex="998",d.style.opacity="0",f.style.zIndex="999",f.style.opacity="1",w=!1,q=!1,I=!0,T=0,L.innerHTML="0000",b&&t.clearInterval(b),S&&t.clearInterval(S),x&&clearInterval(x),V()},O=()=>{b=t.setInterval((()=>{!q&&w&&(h.classList.add("mario-show"),u.style.opacity="0",k=!0,t.setTimeout((()=>{u.classList.remove("pipe-run"),u.style.right="70%"}),1e3),H?G.pause():$.pause(),N.play(),S=t.setInterval((()=>{!q&&w&&(h.classList.remove("mario-show"),u.style.right="-160px",u.style.opacity="1",t.setTimeout((()=>{u.classList.add("pipe-run")}),1e3),k=!1,N.pause(),H?G.play():$.play(),O()),t.clearInterval(S)}),l),t.clearInterval(b))}),a)},P=()=>{M||(w||(w=!0,y.classList.add("mario-show"),u.classList.add("pipe-run"),f.style.opacity=0,$.play(),O()),I?!q&&w&&(M=!0,y.classList.add("jump"),D.play(),t.setTimeout((()=>{y.classList.remove("jump"),M=!1}),600)):K())},Q=(e,t)=>{for(var s=e+"";s.length<t;)s="0"+s;return s},R=(e,t)=>Math.floor(Math.random()*(t-e+1)+e),U=()=>{y.src=H?"img/mario.gif":"img/mario-yoshi.gif",H=!H,H?(k?N.pause():$.pause(),F.play(),G.play()):(G.pause(),J.play(),k?N.play():$.play())},V=()=>{let a=R(c,n);x=t.setInterval((()=>{if(q||!w)return;L.innerHTML=Q(T,4);let l=u.offsetLeft;const h=+t.getComputedStyle(y).bottom.replace("px","");var M=t.innerWidth||e.documentElement.clientWidth||e.body.clientWidth;if(!k&&l<120&&l>0&&h<100||z)if(H&&!z)U(),u.classList.remove("pipe-run"),u.style.left="-160px",l=-160,u.src="img/pipe.png",t.setTimeout((()=>{u.style.right="-160px",u.style.left="auto",t.setTimeout((()=>{j||u.classList.add("pipe-run")}),1e3)}),500);else{$.pause(),N.pause(),G.pause(),W.play(),u.classList.remove("pipe-run"),u.style.left=`${l}px`,y.classList.remove("jump"),y.style.bottom=`${h}px`,y.src="img/game-over.png",y.classList.add("over"),g.style.opacity="1";e.querySelectorAll(".coin").forEach((e=>{e.style.left=`${e.offsetLeft}px`,e.style.animation="none"}));const s=e.querySelector(".egg");s&&(s.style.left=`${s.offsetLeft}px`,s.style.animation="none"),T>E&&(E=T,t.localStorage.setItem(o,E),v.innerHTML=Q(E,4)),t.setTimeout((()=>{y.classList.add("game-over-mario"),t.setTimeout((()=>{y.style.bottom="200px",t.setTimeout((()=>{y.style.bottom="-200px",t.setTimeout((()=>{d.style.opacity="1",d.style.zIndex="999",f.style.zIndex="998",I=!1}),300)}),300)}),300)}),500),q=!0,b&&t.clearInterval(b),S&&t.clearInterval(S),t.clearInterval(x)}if(C>=a&&!q&&w&&l>.1*M&&l<.8*M){a=R(c,k?p:n),C=0;const t=e.createElement("img");t.src="img/coin.png",t.classList.add("coin");const s=R(1,3)%2==0;t.style.bottom=s?"200px":"50px";!e.querySelector(".yoshi-coin")&&s&&!k&&a>n/2&&l>.3*M&&l<.6*M&&(t.src="img/yoshi-coin.gif",t.classList.add("yoshi-coin")),k&&(t.src="img/boo.gif",t.classList.add("boo-coin")),k&&!A||m.appendChild(t),A=!A}C++;const D=function(e){const o=e.offsetLeft,i=+t.getComputedStyle(e).bottom.replace("px",""),r=e.classList.contains("yoshi-coin"),a=e.classList.contains("boo-coin");if((o<=-70||o<130&&o>5&&i>h&&i<h+120)&&(m.removeChild(e),o>5)){let e=i>50;s(a?"boo-coin.mp3":r?"yoshi-coin.mp3":e?"coin2.mp3":"coin.mp3").play(),a?(T-=H?1:2,T<=0?z=!0:H&&U()):(T+=r?5:e?2:1,H&&(T+=r?5:e?2:1))}},F=e.querySelectorAll(".coin");D(F[0]),F[1]&&D(F[1]);let J=e.querySelector(".egg");if(!k&&!J&&!H&&T>0&&(T%i==0||(T+1)%i==0)){const t=e.createElement("img");t.src="img/egg-yoshi.gif",t.classList.add("egg"),m.appendChild(t)}if(J=e.querySelector(".egg"),J){const e=J.offsetLeft,s=+t.getComputedStyle(J).bottom.replace("px","");(e<=0||e<130&&s>h&&s<h+120)&&(m.removeChild(J),e>0&&U())}(T%r==0||(T+1)%r==0)&&T>10&&u.offsetLeft<=-80&&(k||j||(j=!0,B.play(),u.src="img/bowser.gif",u.classList.remove("pipe-run"),u.style.right="-160px",u.style.bottom="10px",t.setTimeout((()=>{u.classList.add("bowser-run"),t.setTimeout((()=>{q||(u.src="img/pipe.png",u.classList.remove("bowser-run"),u.style.right="-160px",u.style.bottom="0px",t.setTimeout((()=>{j=!1,u.classList.add("pipe-run")}),1200))}),1e3)}),1e3)))}),10)};e.addEventListener("keydown",P),m.addEventListener("touchstart",P),v.innerHTML=Q(E,4),v.addEventListener("click",(()=>{if(I&&w)return!1;T=0,E=0,t.localStorage.setItem(o,E),L.innerHTML="0000",v.innerHTML="0000",K()})),d.addEventListener("click",K),f.addEventListener("click",P),V()}(document,window,prepareAudio,gameName,yoshiScore,bowserScore,turnNight,turnDay,minGen,maxGen,maxGenNight);
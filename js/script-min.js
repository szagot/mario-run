!function(e,t,s,o,i,r,a,l,c,n,m){const p=e.querySelector(".game-board"),y=e.querySelector(".mario"),u=e.querySelector(".pipe"),g=e.querySelector(".game-over"),d=e.querySelector(".btn"),f=e.querySelector(".start"),v=e.querySelector(".score"),L=e.querySelector(".max-score"),h=e.querySelector(".night");let b,x,S,I=0,w=!0,T=!1,q=!1,E=+(t.localStorage.getItem(o)||0),C=0,M=!1,H=!1,j=!1,k=!1,z=!1;const $=s("runing.mp3",!0),A=s("yoshi-music.mp3",!0),G=s("night.mp3",!0),N=s("game-over.mp3"),W=s("jump.mp3"),D=s("bowser-laugh.wav"),B=s("yoshi.wav"),F=s("yoshi-off.wav");s("boo-coin.mp3"),s("yoshi-coin.mp3"),s("coin2.mp3"),s("coin.mp3");const J=()=>{h.classList.remove("mario-show"),k=!1,$.pause(),G.pause(),A.pause(),j=!1,y.classList.remove("mario-show"),t.setTimeout((()=>{y.src="img/mario.gif",y.classList.remove("over"),y.classList.remove("game-over-mario"),y.style.bottom="0"}),300),u.src="img/pipe.png",u.style.left="auto",u.style.right="-100px",u.style.bottom="0",u.classList.remove("pipe-run"),u.classList.remove("bowser-run");e.querySelectorAll(".coin").forEach((e=>{p.removeChild(e)}));const s=e.querySelector(".egg");s&&p.removeChild(s),g.style.opacity="0",d.style.zIndex="998",d.style.opacity="0",f.style.zIndex="999",f.style.opacity="1",q=!1,T=!1,w=!0,I=0,v.innerHTML="0000",x&&t.clearInterval(x),S&&t.clearInterval(S),b&&clearInterval(b),U()},K=()=>{x=t.setInterval((()=>{!T&&q&&(h.classList.add("mario-show"),k=!0,H?A.pause():$.pause(),G.play(),S=t.setInterval((()=>{!T&&q&&(h.classList.remove("mario-show"),k=!1,G.pause(),H?A.play():$.play(),K()),t.clearInterval(S)}),l),t.clearInterval(x))}),a)},O=()=>{M||(q||(q=!0,y.classList.add("mario-show"),u.classList.add("pipe-run"),f.style.opacity=0,$.play(),K()),w?!T&&q&&(M=!0,y.classList.add("jump"),W.play(),t.setTimeout((()=>{y.classList.remove("jump"),M=!1}),600)):J())},P=(e,t)=>{for(var s=e+"";s.length<t;)s="0"+s;return s},Q=(e,t)=>Math.floor(Math.random()*(t-e+1)+e),R=()=>{y.src=H?"img/mario.gif":"img/mario-yoshi.gif",H=!H,H?(k?G.pause():$.pause(),B.play(),A.play()):(A.pause(),F.play(),k?G.play():$.play())},U=()=>{let a=Q(c,n);b=t.setInterval((()=>{if(T||!q)return;v.innerHTML=P(I,4);let l=u.offsetLeft;const h=+t.getComputedStyle(y).bottom.replace("px","");var M=t.innerWidth||e.documentElement.clientWidth||e.body.clientWidth;if(l<120&&l>0&&h<100||z)if(H&&!z)R(),u.classList.remove("pipe-run"),u.style.left="-100px",l=-100,u.src="img/pipe.png",t.setTimeout((()=>{u.style.right="-100px",u.style.left="auto",t.setTimeout((()=>{u.classList.add("pipe-run")}),1e3)}),500);else{$.pause(),G.pause(),A.pause(),N.play(),u.classList.remove("pipe-run"),u.style.left=`${l}px`,y.classList.remove("jump"),y.style.bottom=`${h}px`,y.src="img/game-over.png",y.classList.add("over"),g.style.opacity="1";e.querySelectorAll(".coin").forEach((e=>{e.style.left=`${e.offsetLeft}px`,e.style.animation="none"}));const s=e.querySelector(".egg");s&&(s.style.left=`${s.offsetLeft}px`,s.style.animation="none"),I>E&&(E=I,t.localStorage.setItem(o,E),L.innerHTML=P(E,4)),t.setTimeout((()=>{y.classList.add("game-over-mario"),t.setTimeout((()=>{y.style.bottom="200px",t.setTimeout((()=>{y.style.bottom="-200px",t.setTimeout((()=>{d.style.opacity="1",d.style.zIndex="999",f.style.zIndex="998",w=!1}),300)}),300)}),300)}),500),T=!0,x&&t.clearInterval(x),S&&t.clearInterval(S),t.clearInterval(b)}if(C>=a&&!T&&q&&l>.1*M&&l<.9*M){a=Q(c,k?m:n),C=0;const t=e.createElement("img");t.src="img/coin.png",t.classList.add("coin");const s=k?Q(1,3)%2!=0:Q(1,3)%2==0;t.style.bottom=s?"200px":"50px",s&&!k&&a>n/2&&l>.3*M&&l<.6*M&&(t.src="img/yoshi-coin.gif",t.classList.add("yoshi-coin")),k&&(t.src="img/boo.gif",t.classList.add("boo-coin")),p.appendChild(t)}C++;const W=e.querySelector(".coin");if(W){const e=W.offsetLeft,o=+t.getComputedStyle(W).bottom.replace("px",""),i=W.classList.contains("yoshi-coin"),r=W.classList.contains("boo-coin");if((e<=0||e<130&&o>h&&o<h+120)&&(p.removeChild(W),e>0)){let e=o>50;s(r?"boo-coin.mp3":i?"yoshi-coin.mp3":e?"coin2.mp3":"coin.mp3").play(),r?(I--,I<=0?z=!0:H&&R()):(I+=i?5:e?2:1,H&&(I+=i?5:e?2:1))}}let B=e.querySelector(".egg");if(!k&&!B&&!H&&I>0&&(I%i==0||(I+1)%i==0)){const t=e.createElement("img");t.src="img/egg-yoshi.gif",t.classList.add("egg"),p.appendChild(t)}if(B=e.querySelector(".egg"),B){const e=B.offsetLeft,s=+t.getComputedStyle(B).bottom.replace("px","");(e<=0||e<130&&s>h&&s<h+120)&&(p.removeChild(B),e>0&&R())}(I%r==0||(I+1)%r==0)&&I>10&&u.offsetLeft<=-80&&(k||j||(j=!0,D.play(),u.src="img/bowser.gif",u.classList.remove("pipe-run"),u.style.right="-100px",u.style.bottom="10px",t.setTimeout((()=>{u.classList.add("bowser-run"),t.setTimeout((()=>{T||(u.src="img/pipe.png",u.classList.remove("bowser-run"),u.style.right="-100px",u.style.bottom="0px",t.setTimeout((()=>{j=!1,u.classList.add("pipe-run")}),1200))}),1e3)}),1e3)))}),10)};e.addEventListener("keydown",O),p.addEventListener("touchstart",O),L.innerHTML=P(E,4),L.addEventListener("click",(()=>{if(w&&q)return!1;I=0,E=0,t.localStorage.setItem(o,E),v.innerHTML="0000",L.innerHTML="0000",J()})),d.addEventListener("click",J),f.addEventListener("click",O),U()}(document,window,prepareAudio,gameName,yoshiScore,bowserScore,turnNight,turnDay,minGen,maxGen,maxGenNight);
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let W = 800, H = 200, groundY = 150;
let gravity = 0.8, speed = 4, score = 0, best = 0, running = false;
let obstacles = [], birds = [], spawnTimer = 0, birdTimer = 0;
let username = localStorage.getItem("zombie_user") || "Player";

const zombieImg = new Image(); zombieImg.src = "public/zombie.png";
const fenceImg = new Image(); fenceImg.src = "public/fence.png";
const birdImg = new Image(); birdImg.src = "public/bird.png";

const jumpSound = new Audio("public/jump.wav");
const overSound = new Audio("public/gameover.wav");

const dino = { x:50,y:groundY-40,w:44,h:40,vy:0,jumping:false,ducking:false };

function reset(){
  score=0; speed=4; obstacles=[]; birds=[]; running=true;
  dino.y=groundY-dino.h; dino.vy=0; dino.jumping=false; dino.ducking=false;
}

function spawnObstacle(){ obstacles.push({x:W+20,y:groundY-30,w:30,h:30}); }
function spawnBird(){ birds.push({x:W+20,y:100,w:40,h:30}); }

function update(){
  if(!running) return;
  if(dino.jumping){ dino.vy+=gravity; dino.y+=dino.vy; if(dino.y>=groundY-dino.h){ dino.y=groundY-dino.h; dino.vy=0; dino.jumping=false; } }
  for(let o of obstacles){ o.x -= speed; }
  for(let b of birds){ b.x -= speed+1; }
  obstacles = obstacles.filter(o=>o.x+o.w>0);
  birds = birds.filter(b=>b.x+b.w>0);
  spawnTimer--; birdTimer--;
  if(spawnTimer<=0){ spawnObstacle(); spawnTimer=80; }
  if(birdTimer<=0){ spawnBird(); birdTimer=300; }
  for(let o of obstacles){ if(collide(dino,o)){ gameOver(); } }
  for(let b of birds){ if(collide(dino,b)){ gameOver(); } }
  score++;
  if(score%200===0) speed+=0.5;
}
function collide(a,b){ return a.x<a.w+b.x && a.x+a.w>b.x && a.y<a.h+b.y && a.y+a.h>b.y; }
function gameOver(){ running=false; overSound.play(); best=Math.max(best,score); submitScore(username,score); loadLeaderboard(); }

function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle="#ddd"; ctx.fillRect(0,groundY,W,H-groundY);
  ctx.drawImage(zombieImg,dino.x,dino.y,dino.w,dino.h);
  for(let o of obstacles){ ctx.drawImage(fenceImg,o.x,o.y,o.w,o.h); }
  for(let b of birds){ ctx.drawImage(birdImg,b.x,b.y,b.w,b.h); }
  ctx.fillStyle="#333"; ctx.fillText("Score:"+score,W-120,20);
  ctx.fillText("Best:"+best,W-120,40);
  if(!running){ ctx.fillStyle="rgba(0,0,0,0.5)"; ctx.fillRect(W/2-100,H/2-20,200,40); ctx.fillStyle="#fff"; ctx.fillText("Game Over - Restart",W/2-90,H/2+5); }
}

function loop(){ update(); draw(); requestAnimationFrame(loop); }

function jump(){ if(!running){ reset(); return; } if(!dino.jumping){ dino.vy=-12; dino.jumping=true; jumpSound.play(); } }
function duck(start){ dino.ducking=start; }

document.getElementById("restart").onclick=()=>reset();
window.addEventListener("keydown",e=>{ if(e.code==="Space"||e.code==="ArrowUp") jump(); if(e.code==="ArrowDown") duck(true); });
window.addEventListener("keyup",e=>{ if(e.code==="ArrowDown") duck(false); });
canvas.addEventListener("mousedown",jump); canvas.addEventListener("touchstart",jump);

// username
document.getElementById("save-username").onclick=()=>{
  username=document.getElementById("username").value || "Player";
  localStorage.setItem("zombie_user",username);
};

// leaderboard
async function loadLeaderboard(){
  let list=document.getElementById("leaderboard-list");
  list.innerHTML="";
  const {data} = await getLeaderboard();
  data.forEach(row=>{
    let li=document.createElement("li");
    li.textContent=`${row.username} - ${row.score}`;
    list.appendChild(li);
  });
}
reset(); loop(); loadLeaderboard();
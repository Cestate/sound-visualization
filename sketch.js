let osc;
let pianoImg;
let notes = [];


let song;
let amp;
let isPlaying = false;
let playBtn, pauseBtn;
let speedSlider, pitchSlider;
let pitchMul = 1;  

// analyze sound amplitude for visualization
function preload() {
  pianoImg = loadImage("1.jpg");
  song = loadSound("1.mp3"); 
}

function setup() {
  userStartAudio();
  createCanvas(1000, 600);;


  osc = new p5.Oscillator("sine");
  osc.start();
  osc.amp(0);


  amp = new p5.Amplitude();

  textAlign(CENTER);
  textSize(20);


  notes = [
    { x1: 0, x2: 140, name: "C", freq: 261.63 },
    { x1: 140, x2: 280, name: "D", freq: 293.66 },
    { x1: 280, x2: 420, name: "E", freq: 329.63 },
    { x1: 420, x2: 560, name: "F", freq: 349.23 },
    { x1: 560, x2: 700, name: "G", freq: 392.0 },
    { x1: 700, x2: 840, name: "A", freq: 440.0 },
    { x1: 840, x2: 980, name: "B", freq: 493.88 },
    { x1: 980, x2: 1120, name: "C5", freq: 523.25 }
  ];

  // ===== UI Buttons =====
playBtn = createButton("Play");
pauseBtn = createButton("Pause");

playBtn.position(20, 90);
pauseBtn.position(80, 90);

playBtn.mousePressed(() => {
  if (!song.isPlaying()) song.loop();
  isPlaying = true;
});

pauseBtn.mousePressed(() => {
  if (song.isPlaying()) song.pause();
  isPlaying = false;
});


speedSlider = createSlider(0.5, 1.5, 1.0, 0.01);
speedSlider.position(160, 92);
speedSlider.style("width", "160px");


pitchSlider = createSlider(0.5, 2.0, 1.0, 0.01);
pitchSlider.position(380, 92);
pitchSlider.style("width", "160px");

}

function draw() {
  background(245);


  fill(0);
  noStroke();
  rect(0, 0, width, 80);

  fill(255);
  textSize(18);
  text(
    "Click anywhere: Play / Pause music | Click piano keys to play notes",
    width / 2,
    35
  );

  let level = amp.getLevel();
  let size = map(level, 0, 0.3, 20, 200);
  let alpha = map(level, 0, 0.3, 50, 200);

let spd = speedSlider.value();
song.rate(spd);        

pitchMul = pitchSlider.value(); 


  push();
  translate(width / 2, 200);

  noStroke();
  fill(255, 0, 0, alpha);
  ellipse(0, 0, size);

  stroke(0, 0, 255);
  strokeWeight(4);
  line(0, 100, 0, 100 - size);
  pop();


  image(pianoImg, 0, 300, width, 200);
}


function mousePressed() {

  if (!isPlaying) {
    song.loop();
    isPlaying = true;
  } else {
    song.pause();
    isPlaying = false;
  }


  let clickedNote = null;

  if (mouseY > 60 && mouseY < 220) {
    if (mouseX > 100 && mouseX < 180) clickedNote = { name: "C#", freq: 277.18 };
    else if (mouseX > 240 && mouseX < 320) clickedNote = { name: "D#", freq: 311.13 };
    else if (mouseX > 520 && mouseX < 600) clickedNote = { name: "F#", freq: 369.99 };
    else if (mouseX > 660 && mouseX < 740) clickedNote = { name: "G#", freq: 415.3 };
    else if (mouseX > 800 && mouseX < 880) clickedNote = { name: "A#", freq: 466.16 };
  }


  if (!clickedNote && mouseY > 220 && mouseY < 380) {
    for (let n of notes) {
      if (mouseX > n.x1 && mouseX < n.x2) {
        clickedNote = n;
        break;
      }
    }
  }


  if (clickedNote) {
    osc.freq(clickedNote.freq);
    osc.amp(0.5, 0.05);


    fill(255, 0, 0);
    textSize(24);
    text(`${clickedNote.name} - ${nf(clickedNote.freq, 3, 2)} Hz`, width / 2, 370);
    fill(255);
textSize(14);
text(`Speed: ${spd.toFixed(2)}x   Pitch: ${pitchMul.toFixed(2)}x`, width / 2, 62);

  }
}

function mouseReleased() {
  osc.amp(0, 0.3);
  osc.freq(clickedNote.freq * pitchMul);
osc.amp(0.5, 0.05);

}

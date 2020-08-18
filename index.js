const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const dropbox = document.getElementById('overlay');
const fileInput = document.querySelector('input[type=file]')
const fileInputBtn = document.getElementById('inputBtn');

document.addEventListener('dragenter', () => { dropbox.style.display = 'block'; }, false);
document.addEventListener('dragover', drag, false);
dropbox.addEventListener('dragleave', () => { dropbox.style.display = 'none'; }, false)
dropbox.addEventListener('drop', drop, false);

fileInputBtn.addEventListener('click', () => { if(fileInput) fileInput.click(); }, false);
fileInput.addEventListener('change', handleFiles, false);

const minMaxInputs = document.querySelectorAll('input[type=number]');
for(input of minMaxInputs) {
  input.addEventListener('change', handleMinMax);
}

const redMin = document.getElementsByClassName('red min')[0];
const redMax = document.getElementsByClassName('red max')[0];
const greenMin = document.getElementsByClassName('green min')[0];
const greenMax = document.getElementsByClassName('green max')[0];
const blueMin = document.getElementsByClassName('blue min')[0];
const blueMax = document.getElementsByClassName('blue max')[0];

let img;
let imageData;
let pixelsort;

const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', () => { if(img) draw(img); });

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', () => {
  if(img) {
    var a = document.createElement('a');
    a.download = 'pixelsort.png';
    a.href = canvas.toDataURL();
    a.click();
  }
});

document.addEventListener('mousedown', (e) => { console.log(e.offsetX + ' ' + e.offsetY) })

function drag(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  const datatransfer = e.dataTransfer;
  const files = datatransfer.files;

  handleFiles(files);

  dropbox.style.display = 'none';
}

function handleFiles(files) {
  if(files instanceof Event)
    files = this.files;

  for(let i = 0; i < files.length; i++) {
    const file = files[i];

    if(file.type.startsWith("image/")) {
      img = new Image();
      img.addEventListener('load', e => {
        setup();
      });

      const reader = new FileReader();
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result;
        };
      })(img);
      reader.readAsDataURL(file);
    }
  }
}

function handleMinMax(e) {
  e.preventDefault();
  e.stopPropagation();

  //refreshBtn.click();
}

function setupCanvas() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.imageSmoothingEnabled = false;

  let ratio = img.naturalWidth / img.naturalHeight;
  canvas.width = ratio * canvas.height;

  let scale = img.height / canvas.height;
  ctx.scale(1 / scale, 1 / scale);

  ctx.restore();
}

function setup() {
  setupCanvas();
  ctx.drawImage(img, 0, 0);
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  draw();
}

function draw() {
  if(imageData) {
    pixelsort = new Pixelsort(imageData);
    pixelsort.colorChannel.red.min = redMin.value;
    pixelsort.colorChannel.red.max = redMax.value;
    pixelsort.colorChannel.green.min = greenMin.value;
    pixelsort.colorChannel.green.max = greenMax.value;
    pixelsort.colorChannel.blue.min = blueMin.value;
    pixelsort.colorChannel.blue.max = blueMax.value;
    pixelsort.sort();

    pixelsort.loadImageData().then((imageData) => {
      ctx.putImageData(imageData, 0, 0);
    });
  }
}
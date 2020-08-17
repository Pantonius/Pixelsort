var dropbox = document.getElementById('overlay');
var input = document.querySelector('input');
var inputBtn = document.getElementById('inputBtn');

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

dropbox.addEventListener('dragenter', drag, false);
dropbox.addEventListener('dragover', drag, false);
dropbox.addEventListener('drop', drop, false);

input.addEventListener('change', handleFiles, false)

inputBtn.addEventListener('click', () => { if(input) input.click(); }, false);

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
}

function handleFiles(files) {
  if(files instanceof Event)
    files = this.files;

  for(let i = 0; i < files.length; i++) {
    const file = files[i];

    if(file.type.startsWith("image/")) {
      img = new Image();
      img.addEventListener('load', e => {
        draw(img);
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

function setupCanvas(img) {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.imageSmoothingEnabled = false;

  let ratio = img.naturalWidth / img.naturalHeight;
  canvas.width = ratio * canvas.height;

  let scale = img.height / canvas.height;
  ctx.scale(1 / scale, 1 / scale);

  ctx.restore();
}

function draw(img) {
  setupCanvas(img);
  ctx.drawImage(img, 0, 0);
  ctx.putImageData(pixelsort(), 0, 0);
}
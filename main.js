const color = document.querySelector('input');
let screen = document.querySelector('canvas');

let defaultColor = 'black';
let canDraw = false;
let mousex = 0;
let mousey = 0;
let drawings = [];
let ctx = screen.getContext('2d');
let show = true;
color.onchange = () => defaultColor = color.value;

screen.addEventListener('mousedown', mouseDownEvent);
screen.addEventListener('mousemove', mouseMoveEvent);
screen.addEventListener('mouseup', mouseUpEvent);

function mouseDownEvent(e) {
  canDraw = true;
  mousex = e.pageX - screen.offsetLeft;
  mousey = e.pageY - screen.offsetTop;
}

function mouseMoveEvent(e) {
  if (canDraw) {
    draw(e.pageX, e.pageY);
  }
}

function mouseUpEvent() {
  canDraw = false;
}

function draw(x, y) {
  let pointx = x - screen.offsetLeft;
  let pointy = y - screen.offsetTop;

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";

  ctx.closePath();
  ctx.moveTo(mousex, mousey);
  ctx.lineTo(pointx, pointy);
  ctx.strokeStyle = defaultColor;
  ctx.stroke();

  mousex = pointx;
  mousey = pointy;
}

function blind(show) {
  var p = document.getElementById('palavra');
  var backup = p.textContent;

  if (show === false) {
    p.innerHTML = '*******';
  } else {
    p.innerHTML = backup;
  }
}

function toggleWordVisibility() {
  var p = document.getElementById('palavra');
  var button = document.getElementById('toggleButton');

  if (show) {
    p.style.display = 'none'; // Oculta a palavra
    button.textContent = 'Mostrar'; // Atualiza o texto do botão
  } else {
    p.style.display = 'block'; // Mostra a palavra
    button.textContent = 'Ocultar'; // Atualiza o texto do botão
  }

  // Inverte o valor de 'show' para a próxima vez
  show = !show;
}

// Adiciona um ouvinte de evento ao botão para chamar a função
document.getElementById('toggleButton').addEventListener('click', toggleWordVisibility);

function generate(palavras) {
  var p = document.getElementById('palavra');
  var palavraSorteada = palavras[Math.floor(Math.random() * palavras.length)];
  p.textContent = palavraSorteada;
}

document.getElementById('gerarPalavraButton').addEventListener('click', function () {
  const listaDePalavras = ['árvore', 'gato', 'casa', 'carro', 'computador'];
  generate(listaDePalavras);
});

function saveDraw() {
  drawings.push(screen.toDataURL());
  localStorage.setItem('drawings', JSON.stringify(drawings));
  chooseVersionToRestore();
}

function clearLocalStorage() {
  localStorage.clear();
  // Também limpe a lista de versões no <select> após limpar o Local Storage
  const select = document.querySelector('#versionSelect');
  select.innerHTML = '';
  clearBoard()
  chooseVersionToRestore()
}


function chooseVersionToRestore() {
  const savedVersions = JSON.parse(localStorage.getItem('drawings'));
  const select = document.querySelector('#versionSelect');
  select.innerHTML = ''; // Limpa o conteúdo anterior

  if (savedVersions && savedVersions.length > 0) {
    for (let i = 0; i < savedVersions.length; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.text = `Versão ${i + 1}`;
      select.appendChild(option);
    }
  } else {
    const option = document.createElement('option');
    option.text = 'Nenhuma versão salva';
    select.appendChild(option);
  }
}

function restoreVersion() {
  const select = document.querySelector('#versionSelect');
  const selectedIndex = parseInt(select.value, 10);
  const savedVersions = JSON.parse(localStorage.getItem('drawings'));

  if (!isNaN(selectedIndex) && savedVersions && savedVersions.length > selectedIndex) {
    ctx.clearRect(0, 0, screen.width, screen.height);
    const img = new Image();
    img.src = savedVersions[selectedIndex];
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
  }
}

ctx.setTransform(1, 0, 0, 1, 0, 0);



function clearBoard() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
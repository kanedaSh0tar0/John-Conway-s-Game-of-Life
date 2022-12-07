import Live from './live.js';
const live = new Live;
const canvas = live.canvas;
const liveContainer = document.querySelector('.mainCanvasContainer');
const startBtn = document.getElementById('startBtn');
const nextStepBtn = document.getElementById('nextStepBtn');
const resetBtn = document.getElementById('resetBtn');
const timeStepInput = document.getElementById('timeStep');
const stepsPerSecond = document.getElementById('stepsPerSecond');
const steps = document.getElementById('steps');
let areaIsMoving = false;
let interval = 0;
let x = 0;
let y = 0;
live.drawUniverse();
function autoStep() {
    live.isRunning = true;
    live.check();
    live.draw();
    steps.innerText = live.steps === 1 ? '1 step' : `${live.steps} steps`;
}
function mouseMove(event) {
    areaIsMoving = true;
    liveContainer.style.cursor = 'grab';
    const xMove = event.clientX;
    const yMove = event.clientY;
    canvas.style.left = `${xMove - x}px`;
    canvas.style.top = `${yMove - y}px`;
}
startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener('click', () => {
    if (!live.isRunning) {
        live.isRunning = true;
        interval = setInterval(() => {
            autoStep();
        }, live.stepTime);
        startBtn.innerText = 'STOP';
    }
    else {
        live.isRunning = false;
        clearInterval(interval);
        startBtn.innerText = 'START';
    }
});
resetBtn === null || resetBtn === void 0 ? void 0 : resetBtn.addEventListener('click', () => {
    live.drawUniverse();
    steps.innerText = '0 steps';
    clearInterval(interval);
    startBtn ? startBtn.innerText = 'START' : false;
});
nextStepBtn === null || nextStepBtn === void 0 ? void 0 : nextStepBtn.addEventListener('click', () => {
    live.check();
    live.draw();
    steps.innerText = live.steps === 1 ? '1 step' : `${live.steps} steps`;
});
timeStepInput.value = `${1000 / live.stepTime}`;
stepsPerSecond.innerText = `${live.stepTime / 1000}`;
steps.innerText = '0 steps';
timeStepInput === null || timeStepInput === void 0 ? void 0 : timeStepInput.addEventListener('input', () => {
    if (live.isRunning) {
        clearInterval(interval);
        live.setStepTime = +timeStepInput.value;
        stepsPerSecond.innerText = `${+timeStepInput.value}`;
        interval = setInterval(() => {
            autoStep();
        }, live.stepTime);
    }
});
liveContainer.addEventListener('mousedown', (event) => {
    liveContainer.addEventListener('mousemove', mouseMove);
    x = event.clientX - canvas.offsetLeft;
    y = event.clientY - canvas.offsetTop;
});
liveContainer.addEventListener('mouseup', (event) => {
    liveContainer.removeEventListener('mousemove', mouseMove);
    if (!areaIsMoving) {
        steps.innerText = '0 steps';
        live.watchClick(event);
    }
    areaIsMoving = false;
    liveContainer.style.cursor = 'default';
});

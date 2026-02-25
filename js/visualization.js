import { COLORS, BAR_WIDTH, HEIGHT_MULTIPLICATOR } from './config.js';
import { swapArrayElements } from './utils.js';
import { state } from './state.js';

export function getCanvas(index) {
    return document.getElementById(`canvasNr${index}`);
}

export function getValueLabel(index) {
    return document.getElementById(`valueNr${index}`);
}

export function setCanvasHeight(index, value) {
    getCanvas(index).style.height = `${value * HEIGHT_MULTIPLICATOR}px`;
}

export function setCanvasColor(index, color) {
    getCanvas(index).style.backgroundColor = color;
}

export function setLabelValue(index, value) {
    getValueLabel(index).textContent = value;
}

function createCanvas(index, value) {
    const canvas = document.createElement("div");
    canvas.id = `canvasNr${index}`;
    canvas.style = `background-color: ${COLORS.DEFAULT}; width: ${BAR_WIDTH}px; height: ${value * HEIGHT_MULTIPLICATOR}px`;
    return canvas;
}

function createValueLabel(index, value) {
    const valueElement = document.createElement("label");
    valueElement.id = `valueNr${index}`;
    valueElement.classList.add("text-light");
    valueElement.style = `width: ${BAR_WIDTH}px; text-align: center; display: inline-block; box-sizing: border-box; margin: 0; padding: 0;`;
    valueElement.textContent = `${value}`;
    return valueElement;
}

export function initializeVisualization(array) {
    const canvasContainer = document.getElementById("canvasContainer");
    canvasContainer.replaceChildren();

    array.forEach((value, i) => {
        const wrapper = document.createElement("div");
        wrapper.style = "display: flex; flex-direction: column; align-items: center;";
        
        wrapper.appendChild(createCanvas(i, value));
        wrapper.appendChild(createValueLabel(i, value));
        
        canvasContainer.appendChild(wrapper);
    });
}

export function swapVisualization(i, j) {
    setCanvasHeight(i, state.array[j]);
    setCanvasHeight(j, state.array[i]);
    setLabelValue(i, state.array[j]);
    setLabelValue(j, state.array[i]);
    swapArrayElements(i, j);
}

export function resetColors(){
    for(let i = 0; i < state.array.length; i++) {
        setCanvasColor(i, COLORS.DEFAULT);
    }
}
import { state, setState } from './state.js';
import { MAX_VALUE } from './config.js';
import { generateRandomArray, getDelay } from './utils.js';
import { initializeVisualization } from './visualization.js';
import { initializeEventListeners } from './ui.js';

// Initialisierung
const initialSize = document.getElementById("arraySizeSelect").value;
const initialSpeed = document.getElementById("speedRange").value;

setState({
    array: generateRandomArray(initialSize, MAX_VALUE),
    delay: getDelay(initialSpeed)
});

document.getElementById("speedRangeValue").textContent = `${initialSpeed}%`;

initializeVisualization(state.array);
initializeEventListeners();
import { state, setState } from './state.js';
import { ALGORITHMS, PIVOT_STRATEGIES, MAX_VALUE } from './config.js';
import { getDelay, generateRandomArray } from './utils.js';
import { initializeVisualization } from './visualization.js';
import { selectionSort } from './algorithms/selectionSort.js';
import { quickSort } from './algorithms/quickSort.js';

async function sort(algorithm) {
    switch(algorithm) {
        case ALGORITHMS.SELECTION_SORT:
            await selectionSort();
            break;
        case ALGORITHMS.QUICKSORT_LAST_PIVOT:
            setState({ currentPivotStrategy: PIVOT_STRATEGIES.LAST });
            await quickSort();
            break;
        case ALGORITHMS.QUICKSORT_MEDIAN_PIVOT:
            setState({ currentPivotStrategy: PIVOT_STRATEGIES.MEDIAN });
            await quickSort();
            break;
        case ALGORITHMS.QUICKSORT_RANDOM_PIVOT:
            setState({ currentPivotStrategy: PIVOT_STRATEGIES.RANDOM });
            await quickSort();
            break;
    }
}

function setDisableForControls(disabled) {
    const controls = [
        document.getElementById("algorithmSelect"),
        document.getElementById("arraySizeSelect"),
        document.getElementById("generateNewArrayBtn")
    ];

    controls.forEach(control => {
        control.disabled = disabled;
        control.classList.toggle('disabled', disabled);
    });
}

export function initializeEventListeners() {
    // Start Button
    document.getElementById("startBtn").addEventListener("click", async () => {
        if (!state.isSorting) {
            initializeVisualization(state.array);
            const algorithm = document.getElementById("algorithmSelect").value;
            setState({
                delay: getDelay(document.getElementById("speedRange").value),
                isSorting: true,
                isPaused: false
            });
            
            setDisableForControls(true);
            await sort(algorithm);
            setDisableForControls(false);
            
            setState({ isSorting: false });
        }
    });

    // Pause Button
    document.getElementById("pauseBtn").addEventListener("click", () => {
        if (state.isSorting) {
            setState({ isPaused: !state.isPaused });
            document.getElementById("pauseBtn").textContent = state.isPaused ? "▶ Resume" : "⏸ Pause";
        }
    });

    // Stop Button
    document.getElementById("stopBtn").addEventListener("click", () => {
        setState({ isSorting: false, isPaused: false });
        document.getElementById("pauseBtn").textContent = "⏸ Pause";
    });

    // Speed Range
    document.getElementById("speedRange").addEventListener("input", (e) => {
        document.getElementById("speedRangeValue").textContent = `${e.target.value}%`;
        setState({ delay: getDelay(e.target.value) });
    });

    // Array Size Select
    document.getElementById("arraySizeSelect").addEventListener("change", (e) => {
        setState({ array: generateRandomArray(e.target.value, MAX_VALUE) });
        initializeVisualization(state.array);
    });

    // Generate new Array
    document.getElementById("generateNewArrayBtn").addEventListener("click", (e) => {
        setState({ array: generateRandomArray(document.getElementById("arraySizeSelect").value, MAX_VALUE) });
        initializeVisualization(state.array);
    })
}
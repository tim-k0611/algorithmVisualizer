const HEIGHT_MULTIPLICATOR = 5;
const BAR_WIDTH = 20;
const MAX_VALUE = 100;
const SLEEP_TIME = 30;
const MIN_DELAY = 0;
const MAX_DELAY = 800;
const COLORS = {
    DEFAULT: "white",
    COMPARING: "red",
    SMALLEST: "blue",
    SORTED: "green"
};
const ALGORITHMS = {
    SELECTION_SORT: "selectionsort",
    QUICKSORT_LAST_PIVOT: "quicksortLastPivot",
    QUICKSORT_MEDIAN_PIVOT: "quicksortMedianPivot",
    QUICKSORT_RANDOM_PIVOT: "quicksortRandomPivot",
    HEAPSORT: "heapsort",
    BUBBLE_SORT: "bubbleSort",
}
const PIVOT_STRATEGIES = {
    LAST: 'last',
    MEDIAN: 'median',
    RANDOM: 'random'
};
const speedRangeValue = document.getElementById("speedRangeValue");
speedRangeValue.textContent = `${document.getElementById("speedRange").value}%`;

let isSorting = false;
let isPaused = false;
let delay = 0;
let sorted = false;
let currentPivotStrategy = PIVOT_STRATEGIES.LAST;
let array = [];

async function sort(algorithm){
    switch(algorithm) {
        case ALGORITHMS.SELECTION_SORT: await selectionSort(); break;
        case ALGORITHMS.QUICKSORT_LAST_PIVOT: currentPivotStrategy = PIVOT_STRATEGIES.LAST; await quickSort(); break;
        case ALGORITHMS.QUICKSORT_MEDIAN_PIVOT: currentPivotStrategy = PIVOT_STRATEGIES.MEDIAN; await quickSort(); break;
        case ALGORITHMS.QUICKSORT_RANDOM_PIVOT: currentPivotStrategy = PIVOT_STRATEGIES.RANDOM; await quickSort(); break;
    }
}

async function selectionSort(){
    
    for (let counter = 0; counter < array.length; counter++){

        while (isPaused){
            await sleep(100); //Pause was clicked
        }

        if (!isSorting){
            break; //Stop was clicked
        }
        let smallest = await findSmallest(counter);
        await swapVisualization(counter, smallest);
        setCanvasColor(smallest, COLORS.DEFAULT);
        setCanvasColor(counter, COLORS.SORTED);
    }

}

function generateNewArray(arraySize){
    generateRandomArray(arraySize);
    initializeVisualization();
}

async function findSmallest(startIndex){
    let smallest = startIndex;

    for (let i = startIndex; i < array.length; i++){
        setCanvasColor(i, COLORS.COMPARING);
        await sleep(delay);

        while (isPaused) {
            await sleep(100);
        }

        if (!isSorting){
            break;
        }

        if (array[i] < array[smallest] || i === startIndex){
            setCanvasColor(smallest, COLORS.DEFAULT);
            setCanvasColor(i, COLORS.SMALLEST);
            smallest = i;
        } else {
            setCanvasColor(i, COLORS.DEFAULT);
        }
    }

    return smallest;
}

// Pivot-Auswahl-Funktionen
function getPivotIndex(low, high, strategy) {
    switch(strategy) {
        case PIVOT_STRATEGIES.LAST:
            return high;
            
        case PIVOT_STRATEGIES.MEDIAN:
            return Math.floor((low + high) / 2);
            
        case PIVOT_STRATEGIES.RANDOM:
            return getRandomPivot(low, high);
            
        default:
            return high;
    }
}

function getRandomPivot(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

// Quick Sort mit modularer Pivot-Strategie
async function quickSort(low = 0, high = array.length - 1) {
    if (low < high) {
        let pivotIndex = await partition(low, high);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
    
    // Markiere sortierte Elemente am Ende
    if (low === 0 && high === array.length - 1) {
        for (let i = 0; i < array.length; i++) {
            setCanvasColor(i, COLORS.SORTED);
        }
    }
}

async function partition(low, high) {
    // Wähle Pivot basierend auf aktueller Strategie
    const pivotIndex = getPivotIndex(low, high, currentPivotStrategy);
    
    // Markiere gewählten Pivot kurz (optional für Visualisierung)
    // Tausche Pivot ans Ende
    if (pivotIndex !== high) {
        setCanvasColor(pivotIndex, COLORS.COMPARING);
        await sleep(delay);
        await swapVisualization(pivotIndex, high);
    }
    
    let pivot = array[high];
    setCanvasColor(high, COLORS.SMALLEST); // Pivot als blau markieren
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        while (isPaused) {
            await sleep(100);
        }
        
        if (!isSorting) break;
        
        setCanvasColor(j, COLORS.COMPARING);
        await sleep(delay);
        
        if (array[j] < pivot) {
            i++;
            
            if (i !== j) {
                await swapVisualization(i, j);
            }
            
            if (i !== high) setCanvasColor(i, COLORS.DEFAULT);
        }
        
        if (j !== high) setCanvasColor(j, COLORS.DEFAULT);
    }
    
    await swapVisualization(i + 1, high);
    setCanvasColor(i + 1, COLORS.SORTED);
    
    return i + 1;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCanvas(index){
    return document.getElementById(`canvasNr${index}`);
}

function getValueLabel(index) {
    return document.getElementById(`valueNr${index}`);
}

function setCanvasHeight(index, value){
    getCanvas(index).style.height = `${value * HEIGHT_MULTIPLICATOR}px`;
}

function setCanvasColor(index, color){
    getCanvas(index).style.backgroundColor = color;
}

function setLabelValue(index, value) {
    getValueLabel(index).innerHTML = value;
}

function createCanvas(index, value){
    const canvas = document.createElement("canvas");
    canvas.id = `canvasNr${index}`;
    canvas.style = `background-color: ${COLORS.DEFAULT}; width: ${BAR_WIDTH}px; height: ${value * HEIGHT_MULTIPLICATOR}px`;
    return canvas;
}

function createValueToCanvas(index, value){
    const valueElement = document.createElement("label");
    valueElement.id = `valueNr${index}`;
    valueElement.classList.add("text-light");
    valueElement.style = `width: ${BAR_WIDTH}px; text-align: center; display: inline-block; box-sizing: border-box; margin: 0; padding: 0;`;
    valueElement.innerHTML = `${value}`;
    return valueElement;
}

function initializeVisualization(){
    const canvasContainer = document.getElementById("canvasContainer");
    canvasContainer.replaceChildren();

    array.forEach((value, i) => {
        // Erstelle Wrapper für Canvas + Label
        const wrapper = document.createElement("div");
        wrapper.style = "display: flex; flex-direction: column; align-items: center;";
        
        wrapper.appendChild(createCanvas(i, value));
        wrapper.appendChild(createValueToCanvas(i, value));
        
        canvasContainer.appendChild(wrapper);
    });
}

function swapArrayElements(i, j){
    [array[i], array[j]] = [array[j], array[i]];
}

async function swapVisualization(i, j){
    setCanvasHeight(i, array[j]);
    setCanvasHeight(j, array[i]);
    setLabelValue(i, array[j]);
    setLabelValue(j, array[i]);
    swapArrayElements(i, j);
}

function generateRandomArray(size) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * MAX_VALUE) + 1);
    }
}

function getDelay(percentage) {
    const decimalPercentage = percentage / 100;
    return Math.round(MAX_DELAY * Math.pow(1 - decimalPercentage, 2));
}

// Start Button
document.getElementById("startBtn").addEventListener("click", async () => {
    if (!isSorting) {
        initializeVisualization();
        const algorithm = document.getElementById("algorithmSelect").value;
        delay = getDelay(document.getElementById("speedRange").value);
        isSorting = true;
        isPaused = false;
        setDisableForControls(true);
        await sort(algorithm);
        setDisableForControls(false);
        isSorting = false;
    }
});

function setDisableForControls(disabled){
    const controls = [
        document.getElementById("algorithmSelect"),
        document.getElementById("arraySizeSelect"),
        document.getElementById("generateNewArrayBtn")
    ];

    controls.forEach(control => {
        control.disabled = disabled;
        if (disabled){
            control.classList.add('disabled');
        } else {
            control.classList.remove('disabled');
        }
    })
}

// Pause Button
document.getElementById("pauseBtn").addEventListener("click", () => {
    if (isSorting) {
        isPaused = !isPaused;
        document.getElementById("pauseBtn").textContent = isPaused ? "▶ Resume" : "⏸ Pause";
    }
});

// Stop Button
document.getElementById("stopBtn").addEventListener("click", () => {
    isSorting = false;
    isPaused = false;
    document.getElementById("pauseBtn").textContent = "⏸ Pause";
});

document.getElementById("speedRange").addEventListener("input", (e) => {
    speedRangeValue.textContent = `${e.target.value}%`;
    delay = getDelay(e.target.value);
});

document.getElementById("arraySizeSelect").addEventListener("change", (e) => {
    generateNewArray(e.target.value);
})
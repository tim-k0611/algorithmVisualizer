import { state } from '../state.js';
import { COLORS } from '../config.js';
import { sleep } from '../utils.js';
import { setCanvasColor, swapVisualization } from '../visualization.js';

function getPivotIndex(low, high, strategy) {
    switch(strategy) {
        case 'last':
            return high;
        case 'median':
            return Math.floor((low + high) / 2);
        case 'random':
            return Math.floor(Math.random() * (high - low + 1)) + low;
        default:
            return high;
    }
}

async function partition(low, high) {
    const pivotIndex = getPivotIndex(low, high, state.currentPivotStrategy);
    
    if (pivotIndex !== high) {
        setCanvasColor(pivotIndex, COLORS.COMPARING);
        await sleep(state.delay);
        await swapVisualization(state.array, pivotIndex, high);
    }
    
    let pivot = state.array[high];
    setCanvasColor(high, COLORS.SMALLEST);
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        while (state.isPaused) {
            await sleep(100);
        }
        
        if (!state.isSorting) break;
        
        setCanvasColor(j, COLORS.COMPARING);
        await sleep(state.delay);
        
        if (state.array[j] < pivot) {
            i++;
            if (i !== j) {
                await swapVisualization(state.array, i, j);
            }
            if (i !== high) setCanvasColor(i, COLORS.DEFAULT);
        }
        
        if (j !== high) setCanvasColor(j, COLORS.DEFAULT);
    }
    
    await swapVisualization(state.array, i + 1, high);
    setCanvasColor(i + 1, COLORS.SORTED);
    
    return i + 1;
}

export async function quickSort(low = 0, high = state.array.length - 1) {
    if (low < high) {
        let pivotIndex = await partition(low, high);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
    
    if (low === 0 && high === state.array.length - 1) {
        for (let i = 0; i < state.array.length; i++) {
            setCanvasColor(i, COLORS.SORTED);
        }
    }
}
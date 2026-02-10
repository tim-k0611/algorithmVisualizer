import { state } from '../state.js';
import { PIVOT_STRATEGIES } from '../config.js';
import { swapVisualization } from '../visualization.js';
import { setCanvasColor } from '../visualization.js';
import { COLORS } from '../config.js';
import { sleep } from '../utils.js';

export async function quickSort(low = 0, high = state.array.length - 1) {
    if (!state.isSorting) return;

    if (low < high) {
        const pivotIndex = await partition(low, high);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }

    if (low === 0 && high === state.array.length - 1) {
        if (!state.isSorting) return;
        for(let i = 0; i < state.array.length; i++) {
            setCanvasColor(i, COLORS.SORTED);
        }
    }
}

async function partition(low, high) {
    const pivotIndex = getPivotIndex(low, high, state.currentPivotStrategy);

    if (pivotIndex !== high) {
        setCanvasColor(pivotIndex, COLORS.COMPARING);
        await sleep(state.delay);
        await swapVisualization(high, pivotIndex);
    }

    const pivot = state.array[high];
    setCanvasColor(high, COLORS.SMALLEST);
    let lowerThanPivotIndex = low - 1;

    for (let i = low; i < high; i++) {

        setCanvasColor(i, COLORS.COMPARING);
        await sleep(state.delay);
        
        while(state.isPaused) {
            await sleep(100);
        }

        if (!state.isSorting) break;

        if (state.array[i] < pivot) {
            lowerThanPivotIndex++;
            if (i !== lowerThanPivotIndex) {
                await swapVisualization(i, lowerThanPivotIndex);
            }
            if (i !== high) {
                setCanvasColor(i, COLORS.DEFAULT);
            }
        }

        if (i !== high) setCanvasColor(i, COLORS.DEFAULT);
    }

    await swapVisualization(lowerThanPivotIndex + 1, high);
    setCanvasColor(lowerThanPivotIndex + 1, COLORS.SORTED);

    return lowerThanPivotIndex + 1;

}

function getPivotIndex(low, high, pivotStrategy) {
    switch(pivotStrategy) {
        case PIVOT_STRATEGIES.LAST: return high;
        case PIVOT_STRATEGIES.MEDIAN: return Math.floor((high + low) / 2);
        case PIVOT_STRATEGIES.RANDOM: return Math.floor((Math.random() * (high - low + 1)) + low);
    }
}
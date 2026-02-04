import { state } from '../state.js';
import { COLORS } from '../config.js';
import { sleep } from '../utils.js';
import { setCanvasColor, swapVisualization } from '../visualization.js';

async function findSmallest(startIndex) {
    let smallest = startIndex;

    for (let i = startIndex; i < state.array.length; i++) {
        setCanvasColor(i, COLORS.COMPARING);
        await sleep(state.delay);

        while (state.isPaused) {
            await sleep(100);
        }

        if (!state.isSorting) break;

        if (state.array[i] < state.array[smallest] || i === startIndex) {
            setCanvasColor(smallest, COLORS.DEFAULT);
            setCanvasColor(i, COLORS.SMALLEST);
            smallest = i;
        } else {
            setCanvasColor(i, COLORS.DEFAULT);
        }
    }

    return smallest;
}

export async function selectionSort() {
    for (let counter = 0; counter < state.array.length; counter++) {
        while (state.isPaused) {
            await sleep(100);
        }

        if (!state.isSorting) break;

        let smallest = await findSmallest(counter);
        await swapVisualization(state.array, counter, smallest);
        setCanvasColor(smallest, COLORS.DEFAULT);
        setCanvasColor(counter, COLORS.SORTED);
    }
}
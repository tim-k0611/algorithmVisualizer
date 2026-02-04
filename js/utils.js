import { MAX_DELAY } from './config.js';

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDelay(percentage) {
    const decimalPercentage = percentage / 100;
    return Math.round(MAX_DELAY * Math.pow(1 - decimalPercentage, 2));
}

export function generateRandomArray(size, maxValue) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * maxValue) + 1);
    }
    return array;
}

export function swapArrayElements(array, i, j) {
    [array[i], array[j]] = [array[j], array[i]];
}
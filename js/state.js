export let state = {
    isSorting: false,
    isPaused: false,
    delay: 0,
    currentPivotStrategy: null,
    array: []
}

export function setState(updates){
    state = {...state, ...updates};
}
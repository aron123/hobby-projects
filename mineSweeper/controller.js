/**
 * Game controller functions.
 */

function collectControllerData () {
    return {
        resultField: document.querySelector('#controller #result'),
        width: document.querySelector('#width').value,
        height: document.querySelector('#height').value,
        bombCount: document.querySelector('#bombCount').value
    };
}

function startNewGame () {
    let controllerData = collectControllerData();

    controllerData.resultField.innerHTML = '';
    settings.gameWidth = controllerData.width;
    settings.gameHeight = controllerData.height;
    settings.bombCount = controllerData.bombCount;
    initializeField();
}

function displayResult (message) {
    let resultField = collectControllerData().resultField;
    resultField.innerHTML = message;
}
/**
 * Game controller functions.
 */

function collectControllerData () {
    return {
        resultField: document.querySelector('#controller #result'),
        width: document.querySelector('#width'),
        height: document.querySelector('#height'),
        bombCount: document.querySelector('#bombCount')
    };
}

function startNewGame () {
    let controllerData = collectControllerData();
    controllerData.resultField.innerHTML = '';
    controllerToSettings(controllerData, settings);
    initializeField();
}

function initializeController () {
    settingsToController(settings, collectControllerData());
}

function displayResult (message) {
    let resultField = collectControllerData().resultField;
    resultField.innerHTML = message;
}
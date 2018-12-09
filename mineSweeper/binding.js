/**
 * Refreshes the UI, based on the game field matrix.
 * @param {Object} gameTable - HTML div that contains the game table.
 * @param {GameCell[]} gameFieldMatrix - Game field matrix.
 */
function gameFieldToHTML (gameTable, gameFieldMatrix) {
    let cells = gameTable.querySelectorAll('td');

    for (let i=0; i < gameFieldMatrix.length; i++) {
        for (let j=0; j < gameFieldMatrix[i].length; j++) { //iterate over array and refresh UI
            let cell = cells[(i * settings.gameWidth + j)]; //get cell from one-dimension nodelist
            let data = gameFieldMatrix[i][j];

            if (data.visible === false) {
                continue;
            }

            cell.classList.remove('bomb-cell');
            cell.classList.remove('num-cell');

            if (data.value === null) {
                cell.innerHTML = '';
            } else if (data.value === true) {
                cell.classList.add('bomb-cell');
                cell.innerHTML = settings.bombInnerHTML;
            } else if (Number.isInteger(data.value)) {
                cell.classList.add('num-cell')
                cell.innerHTML = (data.value == 0) ? '' : settings.numberCellInnerHTML(data.value);
            }
        }
    }
}

function settingsToController (settings, controller) {
    controller.width.value = settings.gameWidth;
    controller.height.value = settings.gameHeight;
    controller.bombCount.value = settings.bombCount;
}

function controllerToSettings (data, settings) {
    settings.gameWidth = data.width.value;
    settings.gameHeight = data.height.value;
    settings.bombCount = data.bombCount.value;
}
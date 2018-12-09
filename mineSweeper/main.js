/**
 * Game logic functions.
 */

let settings = {
    game: null,
    gameField: null,
    gameWidth: 20,
    gameHeight: 20,
    bombCount: 30,
    defaultCellInnerHTML: '#',
    bombMarkedCellInnerHTML: '~',
    bombInnerHTML: `<div class="bomb-cell">B</div>`,
    numberCellInnerHTML: (num) => `<div class="num-cell" style="color:${settings.numberCellColors[num]}">${num}</div>`,
    numberCellColors: {
        '1': '#0000ff',
        '2': '#007f00',
        '3': '#ff0000',
        '4': '#00007f',
        '5': '#7f0000',
        '6': '#7f7fff',
        '7': '#000000',
        '8': '#7f7f7f'
    },
    winMessageInnerHTML: `<div class="win-msg">YAY, you won.</div>`,
    lostMessageInnerHTML: `<div class="lost-msg">OH NOO, you lost.</div>`,
    settingsInputErrorInnerHTML: (message) => `<div class="error-msg">ERROR: ${message}</div>`
};

const GameCell = function (value, visible = false) {
    this.value = value; //true = bomb, number = number, null = empty
    this.visible = visible;
};

function initializeField () {
    if (settings.bombCount < 1) {
        return displayResult(settings.settingsInputErrorInnerHTML('Bomb count must be greater that or equal to 1'));
    } else if (settings.gameWidth < 1) {
        return displayResult(settings.settingsInputErrorInnerHTML('Game width must be greater that or equal to 1'));
    } else if (settings.gameHeight < 1) {
        return displayResult(settings.settingsInputErrorInnerHTML('Game height must be greater that or equal to 1'));
    } else if (settings.bombCount >= settings.gameWidth * settings.gameHeight) {
        return displayResult(settings.settingsInputErrorInnerHTML('Too much bomb for this game size'));
    } else {
        settings.gameField = createGameField(settings.gameWidth, settings.gameHeight, settings.bombCount);
    }
    
    settings.game = document.querySelector('#app');
    settings.game.innerHTML = '';
    settings.game.appendChild(
        getTable(settings.gameWidth, settings.gameHeight)
    );
    
    const cells = settings.game.querySelectorAll('.game-field-cell');
    addEventListener(cells, 'click', handleCellClick);
    addEventListener(cells, 'contextmenu', handleRightClick);
}

function getTable (width, height) {
    let table = document.createElement('TABLE');

    for (let i=0; i < height; i++) {
        let row = getTableRow(i, width);
        table.appendChild(row);
    }

    return table;
}

function getTableRow (rownum, width) {
    let row = document.createElement('TR');
    
    for (let i=0; i < width; i++) {
        let cell = document.createElement('TD');
        cell.classList.add('game-field-cell');
        cell.setAttribute('rowNum', rownum);
        cell.setAttribute('colNum', i);
        cell.innerHTML = settings.defaultCellInnerHTML;
        row.appendChild(cell);
    }

    return row;
}

function createGameField (width, height, bombCount) {
    //initialize 2-dimension array that represents game field
    let gameField = Array.from({length: height}, () => Array.from(
            {length: width}, 
            () => new GameCell(null)
        )
    );

    //put bombs to field
    let cellIndexes = Array.from(new Array(width * height), (val, index) => index).shuffle();

    for (let i = 0; i < bombCount; i++) {
        let index = cellIndexes.pop();
        let row = Math.floor(index / width);
        let col = index - row * width;
        gameField[row][col] = new GameCell(true);
    }

    //put numbers to field
    for (let i=0; i < settings.gameHeight; i++) {
        for (let j=0; j < settings.gameWidth; j++) {
            if (gameField[i][j].value !== true) { //if not a bomb
                gameField[i][j].value = calculateBombsAroundCell(gameField, i, j);
            }
        }
    }

    return gameField;
}

function calculateBombsAroundCell (field, rownum, colnum) {
    return getNeighboursOfCell(rownum, colnum, true)
            .filter(indexes => getCellOfGameField(field, indexes[0], indexes[1]).value === true).length;
}

function handleCellClick (event) {
    let rownum = event.target.attributes['rownum'].value;
    let colnum = event.target.attributes['colnum'].value;
    let clickedCell = getCellOfGameField(settings.gameField, rownum, colnum);

    if (clickedCell.visible) {
        return;
    }

    clickedCell.visible = true;
    
    if (clickedCell.value == 0) { //set 0-valued neighbours to visible
        getZeroes([rownum, colnum], true).forEach(cell => 
            getCellOfGameField(settings.gameField, cell[0], cell[1]).visible = true
        );
    }

    if (isGameEnded(settings.gameField)) {
        if (isUserWon(settings.gameField)) {
            displayResult(settings.winMessageInnerHTML);
        } else {
            displayResult(settings.lostMessageInnerHTML);
            showAllBombs(settings.gameField);
        }
        removeCellsEventListeners();
    }

    gameFieldToHTML(settings.game, settings.gameField);
}

function handleRightClick (event) {
    event.preventDefault();
    event.target.innerHTML = (event.target.innerHTML == settings.bombMarkedCellInnerHTML) ? // mark/unmark cell as bomb
                                    settings.defaultCellInnerHTML : settings.bombMarkedCellInnerHTML;
}

function removeCellsEventListeners () {
    let cells = settings.game.querySelectorAll('.game-field-cell');
    removeEventListener(cells, 'click', handleCellClick);
    removeEventListener(cells, 'contextmenu', handleRightClick);
}

function getZeroes (clickedCell, getBorders = false) {
    let results = [];
    let mined = [];
    let front = [ clickedCell ];

    while (front.length > 0) {
        let element = front.shift();
        let cell = getCellOfGameField(settings.gameField, element[0], element[1]);

        if (cell.value === 0) {
            mined.push(element);
            results.push(element);
            let neighbours = getNeighboursOfCell(element[0], element[1]);

            neighbours.forEach(neighbour => {
                let cell = getCellOfGameField(settings.gameField, neighbour[0], neighbour[1]);
                if (cell.value !== 0 && cell.value !== true && getBorders) { //add borders if needed
                    return results.push(neighbour);
                }

                if (mined.containsSubArray(neighbour) || front.containsSubArray(neighbour)) {
                    return;
                }

                front.push(neighbour);
            });
        }
    }

    return results;
}

function getNeighboursOfCell (rownum, colnum, getCorners = false) {
    let neighbours = [];

    for (let i = rownum - 1; i <= rownum + 1; i++) {
        for (let j = colnum - 1; j <= colnum + 1; j++) {
            if (i == rownum && j == colnum ||                           //the cell itself
                i < 0 || j < 0 ||                                       //outside the game field (left or up)
                i >= settings.gameHeight || j >= settings.gameWidth) {  //outside the game field (right or bottom)
                continue;
            } else if ( !getCorners && (i != rownum && j != colnum) ) { //do not include corners
                continue;
            }

            neighbours.push([i, j]);
        }
    }

    return neighbours;
}

function showAllBombs (field) {
    for (row of field) {
        for (cell of row) {
            if (cell.value === true) {
                cell.visible = true;
            }
        }
    }
}

function isGameEnded (field) {
    if (isUserWon(field)) {
        return true;
    }

    for (let row of field) {
        for (let cell of row) {
            if (cell.visible && cell.value === true) {
                return true;
            }
        }
    }
    
    return false;
}

function isUserWon (field) {
    for (let row of field) {
        for (let cell of row) {
            if (!cell.visible && cell.value !== true) {
                return false;
            }
        }
    }

    return true;
}

function getCellOfGameField(field, rownum, colnum) {
    return field[rownum][colnum];
}

function addEventListener (nodeList, eventString, callback) {
    for (let node of nodeList) {
        node.addEventListener(eventString, callback);
    }
}

function removeEventListener (nodeList, eventString, callback) {
    for (let node of nodeList) {
        node.removeEventListener(eventString, callback);
    }
}
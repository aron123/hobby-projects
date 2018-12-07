const settings = {
    game: null,
    gameField: null,
    gameWidth: 20,
    gameHeight: 20,
    bombCount: 25,
    defaultCellInnerHTML: '#',
    bombInnerHTML: `<div class="bomb-cell">B</div>`
};

const GameCell = function (value, visible = false) {
    this.value = value;
    this.visible = visible;
};

function initializeField () {
    settings.game = document.querySelector('#app');
    settings.gameField = getGameField(settings.gameWidth, settings.gameHeight, settings.bombCount);
    
    settings.game.innerHTML = '';
    settings.game.appendChild(
        getTable(settings.gameWidth, settings.gameHeight)
    );
    
    const cells = document.querySelectorAll('.game-field-cell');
    for (let cell of cells) {
        cell.addEventListener('click', handleCellClick, false);
    }
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

function getGameField (width, height, bombCount) {
    //initialize 2-dimension array that represents game field
    let gameField = Array.from({length: height}, () => Array.from(
            {length: width}, 
            () => new GameCell(null)
        )
    );

    //put bombs to field
    for (let i = 0; i < bombCount; i++) {
        let col = Math.floor((Math.random() * width));
        let row = Math.floor((Math.random() * height));
        //TODO: avoid collision
        gameField[row][col] = new GameCell(true);
    }

    //put numbers to field
    //TODO: number calculation

    return gameField;
}

function handleCellClick (event) {
    let rownum = event.target.attributes['rownum'].value;
    let colnum = event.target.attributes['colnum'].value;
    settings.gameField[rownum][colnum].visible = true;

    //TODO: if number is 0, set other 0-value cells to visible

    //TODO: if clicked on bomb, set all bomb visible

    arrayToHTML(settings.gameField);
}

function arrayToHTML (array) {
    let cells = settings.game.querySelectorAll('td');

    for (let i=0; i < array.length; i++) {
        for (let j=0; j < array[i].length; j++) { //iterate over array and refresh UI
            let cell = cells[(i*settings.gameWidth + j)]; // get cell from one-dimension nodelist
            let data = array[i][j];

            if (data.visible == false) {
                continue;
            }

            cell.classList.remove('bomb-cell');
            cell.classList.remove('num-cell');

            if (data.value == null) {
                cell.innerHTML = '';
            } else if (data.value == true) {
                cell.classList.add('bomb-cell');
                cell.innerHTML = settings.bombInnerHTML;
            } else if (Number.isInteger(data.value)) {
                cell.classList.add('num-cell')
                cell.innerHTML = getNumberCellInnerHTML(data.value);
            }
        }
    }
}

function getNumberCellInnerHTML (num) {
    return `<div class="num-cell">${num}</div>`
}
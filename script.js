const boardElement = document.querySelector('.board');

const BOARD_SIZE = 8;
let selectedX = null;
let selectedY = null;
let possibleMoves = []

let board = [];

const onSelectCell = (x, y) => {
    console.log(possibleMoves);
    if(selectedX != null && selectedY != null) {
        if(possibleMoves.some(move => move.x == x && move.y == y)) {
            const oldPiece = {...board[selectedX][selectedY]};
            board[selectedX][selectedY].piece = '';
            if(board[x][y]?.piece != '') {
                setTimeout(() => {
                    new Audio(`./sounds/kill.mp3`).play();
                }, 200);
            }
            board[x][y] = oldPiece;
            selectedX = null;
            selectedY = null;
            possibleMoves = [];
            new Audio(`./sounds/${oldPiece.piece}.mp3`).play();
        }
    } else {
        possibleMoves = getPossibleMoves(x, y);
        if(board[x][y].piece == '') return;
        if(x == selectedX && y == selectedY) {
            selectedX = null;
            selectedY = null;
            possibleMoves = [];
        } else {
            selectedX = x;
            selectedY = y;

        }
    }
    


    updateDOM();
}

const getClasses = (x, y) => {
    let classesString = '';
    if(x == selectedX && y == selectedY) {
        classesString += 'border-2 border-black'
    }

    return classesString;
}

const updateDOM = () => {
    const innerHTML = board.map((row, x) => row.map((col, y) => `<div
          class="box cursor-pointer 
            ${getClasses(x, y, col)} ${(x + y) % 2 == 0 ? 'bg-blue-200' : 'bg-pink-500'}
            ${possibleMoves.some(move => move.x == x && move.y == y) ? `border-4 border-green-700` : ''}
        "
          onclick="onSelectCell(${x}, ${y})"
        ><img class="piece" src="./assets/${col.piece ? (col.playerColor+col.piece) : 'empty'}.svg" /></div>`
    ).join('')).join('');

    boardElement.innerHTML = innerHTML;

}

const getInitialPiece = (x, y) => {
    if(x == 1 || x == BOARD_SIZE - 2) return 'P';
    if(x == 0 || x == BOARD_SIZE - 1) {
        return ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'][y];
    }
    return '';
}

const getPossibleMoves = (x, y) => {
    const selected = board[x][y];
    const possiblities = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            if(selected.piece == 'R' || selected.piece == 'Q') {
                if(i == x || j == y) {
                    possiblities.push({ x: i, y: j });
                }  
            }
            if(selected.piece == 'B' || selected.piece == 'Q') {
                if(checkMainDigonal(i, j, x, y) || checkCrossDigonal(i, j, x, y)) {
                    possiblities.push({ x: i, y: j });
                }  
            }
            if(selected.piece == 'K') {
                if(Math.abs(i - x) <= 1 && Math.abs(j - y) <= 1) {
                    possiblities.push({ x: i, y: j });
                }  
            }
            if(selected.piece == 'P') {
                if(checkPawn(i, j, x, y, selected.playerColor)) {
                    possiblities.push({ x: i, y: j });
                }  
            }
            if(selected.piece == 'N') {
                if(checkKnight(i, j, x, y)) {
                    possiblities.push({ x: i, y: j });
                }  
            }
        }
    }
    return possiblities;
}


const checkKnight = (i, j, x, y) => {
    if(x - 1 == i && (y == j - 2 || y == j + 2)) return true;
    if(x + 1 == i && (y == j - 2 || y == j + 2)) return true;
    if(x - 2 == i && (y == j - 1 || y == j + 1)) return true;
    if(x + 2 == i && (y == j - 1 || y == j + 1)) return true;
}

const checkPawn = (i, j, x, y, playerColor) => {
    if((x == 1 && playerColor == 'b') || (x == BOARD_SIZE - 2 && playerColor == 'w')) {
        if(x + (playerColor == 'w' ?  -2 : 2) == i && j == y) return true;
    }
    if(x + (playerColor == 'w' ?  -1 : 1) == i && j == y) return true;

    // have bug
    if(x + (playerColor == 'w' ? -1 : 1)  == i && (y + 1 == j || y - 1 == j) && board[i][j].playerColor == (playerColor == 'b' ? 'w' : 'b')) return true;
    
}

const checkMainDigonal = (i, j, x, y) => {
    if(i == x && j == y) return false;
    while(i < BOARD_SIZE && j < BOARD_SIZE) {
        i++; j++;
    }
    while(0 <= i && 0 <= j) {
        if(i == x && j == y) return true;
        i--; j--;
    }
    return false;
}
const checkCrossDigonal = (i, j, x, y) => {
    if(i == x && j == y) return false;
    while(0 <= i && j < BOARD_SIZE) {
        i--; j++;
    }
    while(i < BOARD_SIZE && 0 <= j) {
        if(i == x && j == y) return true;
        i++; j--;
    }
    return false;
}

const loadGame = () => {
    board = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
        const row = [];
        for(let j = 0; j < BOARD_SIZE; j++) {
            row.push({ 
                piece:  getInitialPiece(i, j),
                playerColor: i < 2 ? 'b' : 'w'
            },)
        }
        board.push(row);
    }

    // board[4][4].piece = 'N';
    // board[4][4].playerColor = 'w';
    
}


loadGame();
updateDOM();
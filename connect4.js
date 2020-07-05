/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let form = document.querySelector('form');
let width = 7;
let height = 7;

// Form to set the board dimensions
form.addEventListener('submit', function(e) {
	e.preventDefault();
	const htmlBoard = document.querySelector('#board');
	htmlBoard.innerHTML = '';
	width = document.querySelector('#board-width').value;
	height = document.querySelector('#board-height').value;

	makeBoard();
	makeHtmlBoard();
});

const restart = document.querySelector('#restart');
restart.addEventListener('click', function(e) {
	const htmlBoard = document.querySelector('#board');
	htmlBoard.innerHTML = '';
	makeBoard();
	makeHtmlBoard();
});

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let h2 = document.querySelector('h2');

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	let temp;
	for (let i = 0; i < height; i++) {
		temp = [];
		for (let j = 0; j < width; j++) {
			temp[j] = null;
		}
		board[i] = temp;
	}
	return board;
};

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.querySelector('#board');
	// TODO: add comment for this code

	//
	let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	// Creates top row and adds td cells for the number of the width
	for (let x = 0; x < width; x++) {
		let headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// Creates rows for the number of the height and adds td cells
	for (let y = 0; y < height; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < width; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
};
/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	// Adds piece to end of array column (height - 1 => 0 due to index rules)
	for (let y = height - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}
/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	let piece = document.createElement('div');
	piece.classList.add('piece');
	piece.classList.add(`p${currPlayer}`);
	piece.style.top = -50 * (y + 2);

	const spot = document.getElementById(`${y}-${x}`);
	spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	setTimeout(() => {
		// alert(msg);
		h2.innerText = msg;
		const htmlBoard = document.querySelector('#board');
		htmlBoard.innerHTML = '';
		makeBoard();
		makeHtmlBoard();
	}, 200);
	// alert(msg);
	// const htmlBoard = document.querySelector('#board');
	// htmlBoard.innerHTML = '';
	// makeBoard();
	// makeHtmlBoard();
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won! 🥇`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	// if (board.every((row) => row.every((cell) => cell))) {
	// 	return endGame('Tie!');
	// }
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame('Tie game');
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
	h2.innerText = `Player turn: Player ${currPlayer}`;
	h2.classList.toggle('p2-turn');
}
/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < height && x >= 0 && x < width && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();

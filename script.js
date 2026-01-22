const gameBoard = (function() {
    const grid = [
        [["X"], ["O"], ["O"]],
        [["O"], ["X"], ["X"]], 
        [["O"], [], ["O"]]
    ];
    const getGridSpaceVal = (rowIndex, colIndex) => grid[rowIndex][colIndex];
    const setGridSpaceVal = (rowIndex, colIndex, gridSpaceVal) => grid[rowIndex][colIndex] = gridSpaceVal;

    return { grid, getGridSpaceVal, setGridSpaceVal };
})()

const gameLogicController = (function() {
    const beginNewGameRound = () => {
        for (let i = 0; i < gameBoard.grid.length; i++) {    
            gameBoard.grid[i] = [[], [], []];
        }
    };
    
    const createNewPlayer = (selectedName, selectedMark) => {
        const playerName = selectedName;
        const playerMark = selectedMark;

        const setPlayerMark = (rowIndex, colIndex) => gameBoard.setGridSpaceVal(rowIndex, colIndex, playerMark);

        return { playerName, playerMark, setPlayerMark };
    }

    const setStartingPlayer = (firstPlayer, secondPlayer) => {
        const players = [firstPlayer, secondPlayer];
        const randomIndex = Math.floor(Math.random() * 2);
        const startingPlayer = players[randomIndex];

        return startingPlayer;
    }

    const getActivePlayer = (firstPlayer, secondPlayer) => setStartingPlayer(firstPlayer, secondPlayer) === firstPlayer ? secondPlayer : firstPlayer;

    const makeActivePlayerMove = () => {
        const currentPlayer = getActivePlayer();
        currentPlayer.setPlayerMark();
    };

    // call w/ horizontal parameter first, then w/ vertical if a winner hasn't been found
    const checkForAGameWin = (loopDirection) => {
        let consecutiveMarks = [];
        let isThereAGameWin = false;

        // straight win check
        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                if (loopDirection === "horizontal") {
                    consecutiveMarks.push(...gameBoard.getGridSpaceVal(outerLoopIndex, innerLoopIndex));
                } else if (loopDirection === "vertical") {
                    consecutiveMarks.push(...gameBoard.getGridSpaceVal(innerLoopIndex, outerLoopIndex));
                }
            }

            if (consecutiveMarks.every((mark) => mark === getActivePlayer().playerMark)) {
            // if (consecutiveMarks.every((mark) => mark === 1)) {
                isThereAGameWin = true;
                console.log(`Player ${getActivePlayer()} has won!`);
                // console.log("A winner!");
                return isThereAGameWin;
            } else {
                consecutiveMarks = [];
                continue;
            }

            // console.log(consecutiveMarks);
        };

        // diagonal win check
        if (isThereAGameWin === false) {
            consecutiveMarks.push(...gameBoard.getGridSpaceVal(0, 0));
            consecutiveMarks.push(...gameBoard.getGridSpaceVal(1, 1));
            consecutiveMarks.push(...gameBoard.getGridSpaceVal(2, 2));

            if (consecutiveMarks.every((mark) => mark === getActivePlayer().playerMark)) {
            // if (consecutiveMarks.every((mark) => mark === 1)) {
                isThereAGameWin = true;
                console.log(`Player ${getActivePlayer()} has won!`);
                return isThereAGameWin;
                // console.log("A winner!");
                // return isThereAGameWin;
            } else {
                consecutiveMarks = [];
                consecutiveMarks.push(...gameBoard.getGridSpaceVal(0, 2));
                consecutiveMarks.push(...gameBoard.getGridSpaceVal(1, 1));
                consecutiveMarks.push(...gameBoard.getGridSpaceVal(2, 0));

                if (consecutiveMarks.every((mark) => mark === getActivePlayer().playerMark)) {
                // if (consecutiveMarks.every((mark) => mark === 1)) {
                    isThereAGameWin = true;
                    console.log(`Player ${getActivePlayer()} has won!`);
                    return isThereAGameWin;
                    // console.log("A winner!");
                    // return isThereAGameWin;
                } else {
                    return isThereAGameWin;
                }
            }
        }
    };

    const checkForAGameTie = () => {
        let isThereAGameTie = false;
        const currentGridValues = [];

        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                currentGridValues.push(...gameBoard.getGridSpaceVal(outerLoopIndex, innerLoopIndex));
            }
        }

        if (currentGridValues.length === 9 && checkForAGameWin("horizontal") === false && checkForAGameWin("vertical") === false) {
            console.log("It's a tie! Neither player wins!");
            isThereAGameTie = true;
            return isThereAGameTie;
        } else {
            return isThereAGameTie;
        }
    };

    const endGameRound = () => `Tic-tac-tover! ${getActivePlayer()} wins the round!`;

    return { 
        beginNewGameRound,
        createNewPlayer,
        setStartingPlayer,
        getActivePlayer,
        makeActivePlayerMove,
        checkForAGameWin,
        checkForAGameTie,
        endGameRound,
    };
})()

const gameDisplayController = (function() {
    const playerOneNameInput = document.querySelector("#player-one-name");
    const playerOneMarkInput = document.querySelector("#player-one-mark");
    const playerTwoNameInput = document.querySelector("#player-two-name");
    const playerTwoMarkInput = document.querySelector("#player-two-mark");
    const markInputReminder = document.querySelector("#mark-input-reminder");
    const playerCreationSubmitBtn = document.querySelector("#submit-btn");
    const gameBoardGridArea = document.querySelector("#gameboard-grid-area");

    // consider reworking this slightly so there's the initial rendering, then a separate function to rerender the latest state of the gameboard i.e. loop over the DOM children of the gameboard grid area, find the corresponding gameboard 2D array's value using the data-attributes of the DOM child element, and set its textContent to the value. We can call this every time a player clicks a grid space.
    const createAndRenderGameBoard = () => {
        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                const gridSpaceSquare = document.createElement("button");

                gridSpaceSquare.setAttribute("data-row", outerLoopIndex);
                gridSpaceSquare.setAttribute("data-column", innerLoopIndex);

                gridSpaceSquare.textContent = gameBoard.grid[outerLoopIndex][innerLoopIndex].length === 0 ? "" : gameBoard.grid[outerLoopIndex][innerLoopIndex];
                gameBoardGridArea.append(gridSpaceSquare);

                // this is just to see the divs, delete later
                // gridSpaceSquare.style.backgroundColor = "blue";
                // gridSpaceSquare.style.height = "100px";
                // gridSpaceSquare.style.width = "100px";
            }
        }
    }
    
    const playerCreationFormHandler = () => {
        if (playerOneMarkInput.value === playerTwoMarkInput.value) {
            markInputReminder.textContent = "Players must have different marks!";
        } else {
            markInputReminder.textContent = "";
            playerCreationSubmitBtn.setAttribute("disabled", "");
            gameLogicController.beginNewGameRound();

            const playerOne = gameLogicController.createNewPlayer(playerOneNameInput.value, playerOneMarkInput.value);
            const playerTwo = gameLogicController.createNewPlayer(playerTwoNameInput.value, playerTwoMarkInput.value);

            return { playerOne, playerTwo };
        }
    } 

    // *** WE ARE HERE!!! ***
    // current task: 
    playerCreationSubmitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // const beginner = gameLogicController.setStartingPlayer(playerCreationFormHandler()["playerOne"], playerCreationFormHandler()["playerTwo"]);
        // const active = gameLogicController.getActivePlayer(playerCreationFormHandler()["playerOne"], playerCreationFormHandler()["playerTwo"]);
        // console.log(beginner);
        // console.log(active);
    });
})()

// pseudocode!!
// write the functions in the gameDisplayController IIFE that allow players to add marks to a specific gameboard grid space by interacting with the right DOM element

// CURRENT TASK --> rework the functions to determine starting and active players + manually test them

// set an event listener on the gameBoardGridArea to use event bubbling so a listener is set on all its children (aka the gameboard spaces)
// we pass it a callback function, in which we:
    // get the row and column attributes of the target from the event (ought to be a click)
    // check if the target's textContent is already occupied
        // if so then simply return
        // else, set the target's textContent to the active player's mark (see above note about rerendering), update the corresponding 2D array position in the gameboard grid array with the active player's mark, and check for a win and tie
    // if a tie or win is found, then end the game round and enable the play button + form inputs again, allowing the process to repeat upon a click

// Testing/Debugging Process: play a game round!

// Begin a new game round
// Create players

// Determine active player
// Make a mark on the gameboard grid
// Repeat above process until a win or tie is reached
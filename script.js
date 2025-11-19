// BRAINSTORMING

// to PLAY, we need:
// • a gameboard (one instance --> IIFE), whose features are
    // 3x3 grid, 3 rows and 3 columns to make 9 spaces <-- OBJ PROPERTY
    // each space is identified by a row and a column
    // these spaces need to be accessible and updateable (so they ought to be exposed via a pair of get and set functions when the instance is returned)
// • 2 players (multiple instances of a player --> a factory function to produce them), who have:
    // a unique identity (e.g. a name) <-- OBJ PROPERTY
    // the ability to populate the 9 grid spaces with a specific value(let's say 0 and 1 for now) <-- OBJ METHOD
// • a game logic controller (one instance --> IIFE), whose features are:
        // the ability to let a player make a move: access a space on the gameboard and change that space's values <-- OBJ method
        // the ability to capture what value was added prior to the current value (e.g. to add a 0, a 1 must have been added before, and vice versa), and which player added that value, and to which grid space <-- OBJ METHOD (seems like this info would be grabbed from when a player makes a move)
        // the ability to "switch" between which player is the current active player who can add their respective value to their chosen board space, aka a turn changer <-- OBJ METHOD
        // the ability to determine:
            // winning conditions + determine the player who won <-- OBJ METHOD
            // tying conditions <-- OBJ METHOD
        // the ability to designate a player as a winner <-- OBJ METHOD
        // the ability to end a game round <-- OBJ METHOD
        // the ability to begin a new game round <-- OBJ METHOD

// • to WIN, we need:
    // to track and compare the values of the grid spaces
    // to identify winning conditions: 3 consecutive spaces filled with the same value belonging to the same player (so 3 straight 1s or 3 straight 0s)
    // conversely, tying conditions are also identifiable: a full grid w/o any winning conditions met
    // seems like it'd be tucked inside the game logic controller

// PSEUDOCODE

// IIFE Function gameBoard (module pattern)
    // Pass in: n/a
    // Create a single instance of an object to represent the gameboard, whose properties are:
        // the grid itself, a 2D array with 3 rows and 3 columns
        // a function that reads (gets) the value of the space passed to it (parameters are the row and col indices)
        // a function that modifies (sets) the value of the space passed to it with a given value (parameters are the row and col indicies and the given value)
    // Pass out: gameboard object
// Endfunction
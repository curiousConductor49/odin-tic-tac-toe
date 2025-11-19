// PSEUDOCODE

// to PLAY, we need:
// • a gameboard, whose features are
    // 3x3 grid, 3 rows and 3 columns to make 9 spaces
    // each space is identified by a row and a column
    // these spaces need to be accessible and updateable (read and modify their values)
// • the ability to populate the 9 grid spaces with specific values(let's say 0 and 1 for now)
// • the ability to "switch" between players aka turns
    // this means being aware of what value was added prior to the current value (e.g. to add a 0, a 1 must have been added before, and vice versa), irregardless of where that value was added
    
// • to WIN, we need:
    // to track and compare the values of the grid spaces
    // to identify winning conditions: 3 consecutive spaces filled with the same value (so 3 straight 1s or 3 straight 0s)
    // conversely, tying conditions are also identifiable: a full grid w/o any winning conditions met
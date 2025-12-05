/*
  kahoot.js

  Purpose:
  - Generate a rectangular maze using a row-by-row algorithm (similar to Eller's algorithm)
  - Render the maze into an HTML canvas with id `c1`
  - Place numbers in dead-end cells after maze generation completes

  How to differentiate "walls" vs "cells that are not walls":
  - Cells: represented by `Cell` objects stored in a 2D array `cells[col][row]`.
    Each `Cell` has properties:
      - `i, j`: column and row indices
      - `index`: set id used during generation to join sets
      - `inMaze`: boolean indicating the cell is part of the carved maze area
      - `number` (optional): a number placed in dead-end cells after generation
    A cell is never a "wall" — walls live *between* cells.

  - Walls: represented by `Wall` objects stored in two flat arrays: `horizontal` and `vertical`.
    Each `Wall` has properties:
      - `i1, j1, i2, j2`: coordinates of the two cells it separates
      - `removed`: boolean indicating whether the wall has been removed (passage created)
      - `x1,y1,x2,y2`: pixel coordinates used for drawing the line on canvas
    If `wall.removed === false`, the wall is present; if `true`, the passage exists between the two cells.

  Differentiating in code:
  - To check if two adjacent cells are connected, find the wall object that separates them and test `!wall.removed`.
  - To check whether a cell is part of the carved maze area, test `cell.inMaze`.

  Input / Output conventions for functions are documented in the header comments above each function.
*/

// Module-level variables used by the generator and renderer.
// They are initialized inside `draw()` before use.
let rows, cols, inc, c, cells, horizontal, vertical, index, interval, hi, done, speed;

/*
  Class: Cell
  Input: (i: number, j: number) - column and row indices
  Output: instance with properties { i, j, index, inMaze, number? }
  Notes: `index` is used by the generation algorithm to group cells into sets.
*/
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.index = this.j + this.i * rows; // unique id per cell initially
    this.inMaze = false; // becomes true when this cell has been reached by the algorithm
    // optional: `number` property may be set later by `place_numbers()`
  }

  // Draw the cell as a filled square only if it's part of the maze (inMaze === true)
  show() {
    if (this.inMaze) c.fillRect(this.i * inc, this.j * inc, inc, inc);
  }
}

/*
  Class: Wall
  Input: (i1, j1, i2, j2) - coordinates of the two adjacent cells the wall separates
  Output: instance with properties { i1, j1, i2, j2, removed, x1, y1, x2, y2 }
  Notes: `removed` starts as false. When set to true, the wall is considered removed and not drawn.
*/
class Wall {
  constructor(i1, j1, i2, j2) {
    this.i1 = i1;
    this.j1 = j1;
    this.i2 = i2;
    this.j2 = j2;
    this.removed = false;

    // Precompute pixel coordinates for drawing the wall line on canvas.
    // Horizontal walls (same i) are drawn as horizontal lines between two cells;
    // Vertical walls (same j) are drawn as vertical lines.
    if (i1 - i2 == 0) {
      // vertical alignment (wall runs horizontally between rows)
      let y1 = cells[i1][j1].j * inc + inc / 2;
      let y2 = cells[i2][j2].j * inc + inc / 2;
      this.x1 = cells[i1][j1].i * inc;
      this.y1 = (y1 + y2) / 2;
      this.x2 = cells[i1][j1].i * inc + inc;
      this.y2 = this.y1;
    } else {
      // horizontal alignment (wall runs vertically between columns)
      let x1 = cells[i1][j1].i * inc + inc / 2;
      let x2 = cells[i2][j2].i * inc + inc / 2;
      this.x1 = (x1 + x2) / 2;
      this.y1 = cells[i1][j1].j * inc;
      this.x2 = this.x1;
      this.y2 = cells[i1][j1].j * inc + inc;
    }
  }

  // Draw the wall as a line only when it has not been removed
  show() {
    c.beginPath();
    c.moveTo(this.x1, this.y1);
    c.lineTo(this.x2, this.y2);
    c.stroke();
  }
}

function draw() {
  /**
   * Function: draw
   * Input: none (reads/writes module-level variables)
   * Output: starts maze generation + rendering loop; returns void
   * Summary: Initializes the grid, wall lists and canvas, then starts the
   *          animated generation by calling `step()` repeatedly.
   */
  const canvas = document.getElementById('c1');
  c = canvas.getContext('2d');
  inc = 20;           // cell pixel size
  speed = 2;          // how many wall-operations to attempt per animation frame
  done = false;       // becomes true once generation completes
  cols = 8;           // number of columns (change to 30 for 30x30)
  rows = 8;           // number of rows

  // Set canvas pixel size to match maze size
  canvas.width = cols * inc;
  canvas.height = rows * inc;

  // algorithm state variables
  index = 0;          // current index into vertical walls processing
  interval = cols - 1; // when to process horizontal set step
  hi = 0;             // index into horizontal walls during grouping
  cells = [];         // 2D array of Cell instances
  for (let i = 0; i < cols; i++) {
    cells[i] = [];
    for (let j = 0; j < rows; j++) cells[i][j] = new Cell(i, j);
  }
  horizontal = [];
  vertical = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (j < rows-1) horizontal.push(new Wall(i, j, i, j+1));
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (i < cols-1) vertical.push(new Wall(i, j, i+1, j));
  c.fillStyle = 'rgb(255, 255, 255)';
  c.lineCap = 'square';
  c.lineWidth = inc/2;
  c.strokeStyle = 'rgb(0, 0, 0)';
  // flag to ensure numbers are placed only once after generation finishes
  let numberPlaced = false;
  
  /**
   * Function: renderMaze
   * Input: none (reads module-level & local arrays)
   * Output: draws the current maze state to the canvas
   * Notes: Draws filled cells first, then remaining walls, then outer border.
   */
  function renderMaze() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all cells that have been marked as part of the maze
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) cells[i][j].show();

    // Draw any walls that are still present
    for (let i = 0; i < horizontal.length; i++) if (!horizontal[i].removed) horizontal[i].show();
    for (let i = 0; i < vertical.length; i++) if (!vertical[i].removed) vertical[i].show();

    // Outer border
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(cols * inc, 0);
    c.lineTo(cols * inc, rows * inc);
    c.lineTo(0, rows * inc);
    c.closePath();
    c.stroke();
  }

  /**
   * Function: step
   * Input: none (uses closure variables)
   * Output: advances the generation by up to `speed` operations, then requests next frame
   * Summary: Processes vertical walls sequentially and, at intervals, processes horizontal sets
   */
  function step() {
    for (let a = 0; a < speed; a++) {
      // If we've processed all vertical walls, mark done and stop processing
      if (index >= vertical.length) {
        done = true;
        break;
      }

      // Mark the two adjacent cells touched by this vertical wall as "visited" (inMaze)
      cells[vertical[index].i1][vertical[index].j1].inMaze = true;
      cells[vertical[index].i2][vertical[index].j2].inMaze = true;

      // Random chance to remove the wall (carve a passage) or always remove on the last row
      if (Math.random() < 0.7 || vertical[index].j1 == rows - 1) {
        let newIndex = cells[vertical[index].i1][vertical[index].j1].index;
        let oldIndex = cells[vertical[index].i2][vertical[index].j2].index;
        // Merge the two sets if they are different by reassigning cell.index across the grid
        if (oldIndex != newIndex) {
          for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) if (cells[i][j].index == oldIndex) cells[i][j].index = newIndex;
          vertical[index].removed = true; // removing the wall creates a passage
        }
      }

      index++;

      // When we've processed `interval` vertical walls, process a horizontal-row step
      if (index > interval - 1) {
        let sets = [];
        // Group horizontal walls by the set id of the cell above them.
        for (let i = 0; i < cols; i++) {
          if (hi >= horizontal.length) break; // safety: avoid out-of-range access
          const h = horizontal[hi];
          const setIndex = cells[h.i1][h.j1].index;
          if (sets[setIndex] == undefined) sets[setIndex] = [];
          sets[setIndex].push(h);
          hi++;
        }

        // For each set, remove one or more horizontal walls to connect downwards
        for (let i = 0; i < sets.length; i++) {
          if (sets[i] != undefined) {
            // choose how many walls to remove from this set (must be at least 1)
            let times = Math.max(Math.floor(Math.random() * (sets[i].length - 2) + 1), 1);
            for (let j = 0; j < times; j++) {
              let ind = Math.floor(Math.random() * sets[i].length);
              while (sets[i][ind].removed) ind = Math.floor(Math.random() * sets[i].length);
              let wall = sets[i][ind];
              let newIndex = cells[wall.i1][wall.j1].index;
              let oldIndex = cells[wall.i2][wall.j2].index;
              if (oldIndex != newIndex) {
                // mark cell below as part of maze and merge sets
                cells[wall.i2][wall.j2].inMaze = true;
                cells[wall.i2][wall.j2].index = newIndex;
                wall.removed = true;
              }
            }
          }
        }
        interval += cols - 1; // advance interval for next horizontal step
      }
    }
    // If generation finished, place numbers once and then render
    if (done && !numberPlaced) {
      place_numbers(cells);
      numberPlaced = true;
    }
    renderMaze();
    if (!done) requestAnimationFrame(step);
  }

  // Start the animation loop
  step();
}

/*
  Function: place_numbers
  Input:
    - liste: Array<number>  -- numbers to place (e.g. [1,2,3,...])
    - maze: Array<Array<Cell>> -- the 2D `cells` array used by the generator
  Output: void (assigns `cell.number` for chosen cells)

  Summary:
  - Scans the `maze` for dead-end cells (3 or more blocking neighbours) and
  - Places numbers from `liste` into random dead-end cells until the list is
    exhausted or there are no more dead-ends.

  Notes:
  - This function mutates `maze` by setting `maze[i][j].number`.
  - It assumes each `maze[i][j]` is a `Cell` instance with an `inMaze` boolean.
*/
function place_numbers(maze) {
  let liste = [0,1,2,3,4,5,6,7,8,9, -1];
  // Validate inputs
  if (!Array.isArray(liste) || !Array.isArray(maze)) return;

  // collect all dead-end cells
  const deadEnds = [];
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      const cell = maze[i][j];
      if (!cell || !cell.inMaze) continue; // skip uncarved cells
      console.log(`Checking cell at (${i}, ${j}) for dead-end status.`);
      let walls = 0;

      if (i === 0 || !maze[i -1][j].inMaze) walls++;
      // right: column + 1
      if (i === maze.length - 1 || !maze[i + 1][j].inMaze) walls++;
      // up: row - 1
      if (j === 0 || !maze[i][j - 1].inMaze) walls++;
      // down: row + 1
      if (j === maze[i].length - 1 || !maze[i][j + 1].inMaze) walls++;

      if (walls >= 3) deadEnds.push(cell);
    }
  }
  console.log(`Found ${deadEnds.length} dead-end cells.`);
  if (deadEnds.length < 11) {
    // Not enough dead-ends found. Do not recursively regenerate here
    // to avoid re-entrant calls; instead log and continue.
    console.warn(`Only ${deadEnds.length} dead-ends found; skipping regeneration.`);
    draw();
  }
  // Shuffle dead ends to place numbers randomly
  for (let k = deadEnds.length - 1; k > 0; k--) {
    const r = Math.floor(Math.random() * (k + 1));
    [deadEnds[k], deadEnds[r]] = [deadEnds[r], deadEnds[k]];
  }

  // Place numbers into dead-end cells until we run out
  for (let idx = 0; idx < liste.length && idx < deadEnds.length; idx++) {
    deadEnds[idx].number = liste[idx];
  }
}

export { Cell, Wall, draw };
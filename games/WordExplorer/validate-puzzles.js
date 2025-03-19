// Word Explorer - Puzzle Validator
// This script validates all puzzles to ensure they are correctly defined

// Import the word data
// Since word-data.js uses const LEVELS and exports WordData, we need to define it here
const fs = require('fs');
const path = require('path');

// Read the word-data.js file
const wordDataPath = path.join(__dirname, 'word-data.js');
const wordDataContent = fs.readFileSync(wordDataPath, 'utf8');

// Extract the LEVELS array using regex
const levelsMatch = wordDataContent.match(/const LEVELS = (\[[\s\S]*?\n\];)/);
if (!levelsMatch) {
  console.error('Could not find LEVELS array in word-data.js');
  process.exit(1);
}

// Evaluate the LEVELS array
let LEVELS;
try {
  // Replace export statement if it exists
  const levelsCode = levelsMatch[1].replace(/export\s+const\s+WordData.*/, '');
  // Use eval in a controlled way to parse the LEVELS array
  eval('LEVELS = ' + levelsCode);
} catch (error) {
  console.error('Error parsing LEVELS array:', error);
  process.exit(1);
}

// Create WordData object
const WordData = { levels: LEVELS };

// Function to validate all puzzles
function validatePuzzles () {
  console.log('Validating Word Explorer puzzles...');
  let hasErrors = false;
  let totalErrors = 0;

  // Loop through each level
  WordData.levels.forEach(level => {
    console.log(`\nValidating Level ${level.id}: ${level.title}`);

    // Check for duplicate word IDs
    const wordIds = new Set();
    const duplicateIds = [];
    level.words.forEach(word => {
      if (wordIds.has(word.id)) {
        duplicateIds.push(word.id);
      } else {
        wordIds.add(word.id);
      }
    });

    if (duplicateIds.length > 0) {
      console.error(`  ❌ Duplicate word IDs found: ${duplicateIds.join(', ')}`);
      hasErrors = true;
      totalErrors++;
    } else {
      console.log('  ✓ No duplicate word IDs');
    }

    // Validate each word
    level.words.forEach(word => {
      console.log(`  Checking word: ${word.word} (ID: ${word.id})`);

      // Check if word fits in the grid
      const fits = checkWordFitsInGrid(word, level.grid);
      if (!fits.valid) {
        console.error(`    ❌ Word does not fit in grid: ${fits.reason}`);
        hasErrors = true;
        totalErrors++;
      } else {
        console.log('    ✓ Word fits in grid');
      }

      // Check if word letters match grid data
      const lettersMatch = checkWordLettersMatchGrid(word, level.grid);
      if (!lettersMatch.valid) {
        console.error(`    ❌ Word letters don't match grid: ${lettersMatch.reason}`);
        hasErrors = true;
        totalErrors++;
      } else {
        console.log('    ✓ Word letters match grid');
      }

      // Check if word has a valid clue
      if (!word.clue || word.clue.trim() === '') {
        console.error('    ❌ Word has no clue');
        hasErrors = true;
        totalErrors++;
      } else {
        console.log('    ✓ Word has a valid clue');
      }

      // Check if word has a valid image
      if (!word.image || word.image.trim() === '') {
        console.error('    ❌ Word has no image');
        hasErrors = true;
        totalErrors++;
      } else {
        console.log('    ✓ Word has a valid image');
      }
    });

    // Check for grid consistency
    const gridConsistency = checkGridConsistency(level.grid, level.words);
    if (!gridConsistency.valid) {
      console.error(`  ❌ Grid inconsistency: ${gridConsistency.reason}`);
      hasErrors = true;
      totalErrors++;
    } else {
      console.log('  ✓ Grid is consistent');
    }
  });

  // Print summary
  console.log('\n=== Validation Summary ===');
  if (hasErrors) {
    console.error(`❌ Found ${totalErrors} errors in the puzzles. Please fix them before proceeding.`);
  } else {
    console.log('✓ All puzzles are valid!');
  }

  return !hasErrors;
}

// Function to check if a word fits in the grid
function checkWordFitsInGrid (word, grid) {
  // Check if starting position is within grid bounds
  if (word.row < 0 || word.row >= grid.rows || word.col < 0 || word.col >= grid.cols) {
    return {
      valid: false,
      reason: `Starting position (${word.row},${word.col}) is outside grid bounds (${grid.rows}x${grid.cols})`
    };
  }

  // Check if word fits within grid bounds
  if (word.direction === 'across') {
    if (word.col + word.word.length > grid.cols) {
      return {
        valid: false,
        reason: `Word extends beyond right edge of grid (col ${word.col} + length ${word.word.length} > grid width ${grid.cols})`
      };
    }
  } else { // down
    if (word.row + word.word.length > grid.rows) {
      return {
        valid: false,
        reason: `Word extends beyond bottom edge of grid (row ${word.row} + length ${word.word.length} > grid height ${grid.rows})`
      };
    }
  }

  return { valid: true };
}

// Function to check if word letters match grid data
function checkWordLettersMatchGrid (word, grid) {
  for (let i = 0; i < word.word.length; i++) {
    const letter = word.word[i].toUpperCase();
    let row, col;

    if (word.direction === 'across') {
      row = word.row;
      col = word.col + i;
    } else { // down
      row = word.row + i;
      col = word.col;
    }

    // Check if cell is within grid bounds
    if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) {
      return {
        valid: false,
        reason: `Letter ${letter} at position ${i} is outside grid bounds at (${row},${col})`
      };
    }

    // Get cell data
    const cellData = grid.data[row]?.[col];

    // Check if cell is null (black cell)
    if (cellData === null) {
      return {
        valid: false,
        reason: `Letter ${letter} at position ${i} is in a black cell at (${row},${col})`
      };
    }

    // If cell has a letter, check if it matches
    if (typeof cellData === 'string' && cellData.toUpperCase() !== letter) {
      return {
        valid: false,
        reason: `Letter ${letter} at position ${i} doesn't match grid letter ${cellData.toUpperCase()} at (${row},${col})`
      };
    }
  }

  return { valid: true };
}

// Function to check grid consistency
function checkGridConsistency (grid, words) {
  // Create a grid representation to check for conflicts
  const gridRepresentation = Array(grid.rows).fill().map(() =>
    Array(grid.cols).fill(null)
  );

  // Fill grid with word IDs
  for (const word of words) {
    for (let i = 0; i < word.word.length; i++) {
      let row, col;

      if (word.direction === 'across') {
        row = word.row;
        col = word.col + i;
      } else { // down
        row = word.row + i;
        col = word.col;
      }

      // Check if cell is within grid bounds
      if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) {
        continue; // Skip this cell, it will be caught by other validations
      }

      // Check if cell already has a letter from another word
      if (gridRepresentation[row][col] !== null &&
                gridRepresentation[row][col] !== word.id) {
        // This is actually okay if the letters match (intersection)
        const letter1 = word.word[i].toUpperCase();
        const otherWordId = gridRepresentation[row][col];
        const otherWord = words.find(w => w.id === otherWordId);

        if (otherWord) {
          let otherLetterIndex;
          if (otherWord.direction === 'across') {
            otherLetterIndex = col - otherWord.col;
          } else { // down
            otherLetterIndex = row - otherWord.row;
          }

          const letter2 = otherWord.word[otherLetterIndex].toUpperCase();

          if (letter1 !== letter2) {
            return {
              valid: false,
              reason: `Conflict at (${row},${col}): Word ${word.id} (${word.word}) has letter ${letter1}, but word ${otherWordId} (${otherWord.word}) has letter ${letter2}`
            };
          }
        }
      } else {
        gridRepresentation[row][col] = word.id;
      }
    }
  }

  return { valid: true };
}

// Run the validation
const isValid = validatePuzzles();

// Exit with appropriate code
process.exit(isValid ? 0 : 1);

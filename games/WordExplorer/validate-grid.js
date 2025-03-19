// Word Explorer - Grid Validator for Level 1
// This script validates the grid for Level 1 to ensure the "TOP" word is correctly positioned

// Level 1 data
const level1 = {
  id: 1,
  title: 'Easy CVC Words',
  description: 'Simple three-letter words',
  grid: {
    rows: 5,
    cols: 5,
    data: [
      [null, 'S', 'T', null, null],
      [null, 'U', 'C', 'T', null],
      [null, 'N', 'A', 'O', null],
      [null, null, 'T', 'P', null],
      [null, null, 'D', 'O', 'G']
    ]
  },
  words: [
    {
      id: 1,
      word: 'CAT',
      clue: 'A furry pet that says meow',
      direction: 'down',
      row: 1,
      col: 2,
      image: 'cat.png'
    },
    {
      id: 2,
      word: 'SUN',
      clue: 'It shines in the sky during the day',
      direction: 'down',
      row: 0,
      col: 1,
      image: 'sun.png'
    },
    {
      id: 3,
      word: 'TOP',
      clue: 'The opposite of bottom',
      direction: 'down',
      row: 1,
      col: 3,
      image: 'top.png'
    },
    {
      id: 4,
      word: 'DOG',
      clue: 'A pet that barks',
      direction: 'across',
      row: 4,
      col: 2,
      image: 'dog.png'
    }
  ],
  hintsAllowed: 3
};

// Function to validate a word in the grid
function validateWord (word, grid) {
  console.log(`Validating word: ${word.word} (ID: ${word.id})`);

  // Check if word fits in the grid
  if (word.direction === 'across') {
    if (word.col + word.word.length > grid.cols) {
      console.error('  ❌ Word extends beyond right edge of grid');
      return false;
    }
  } else { // down
    if (word.row + word.word.length > grid.rows) {
      console.error('  ❌ Word extends beyond bottom edge of grid');
      return false;
    }
  }

  // Check each letter of the word
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

    // Get cell data
    const cellData = grid.data[row]?.[col];

    // Check if cell is null (black cell)
    if (cellData === null) {
      console.error(`  ❌ Letter ${letter} at position ${i} is in a black cell at (${row},${col})`);
      return false;
    }

    // If cell has a letter, check if it matches
    if (typeof cellData === 'string' && cellData.toUpperCase() !== letter) {
      console.error(`  ❌ Letter ${letter} at position ${i} doesn't match grid letter ${cellData.toUpperCase()} at (${row},${col})`);
      return false;
    }

    console.log(`  ✓ Letter ${letter} is correctly positioned at (${row},${col})`);
  }

  return true;
}

// Validate Level 1
console.log(`Validating Level ${level1.id}: ${level1.title}`);
let allValid = true;

// Validate each word
for (const word of level1.words) {
  const isValid = validateWord(word, level1.grid);
  if (!isValid) {
    allValid = false;
  }
}

// Print summary
console.log('\n=== Validation Summary ===');
if (allValid) {
  console.log('✓ All words in Level 1 are valid!');
} else {
  console.error('❌ Found errors in Level 1. Please fix them before proceeding.');
}

// Exit with appropriate code
process.exit(allValid ? 0 : 1);

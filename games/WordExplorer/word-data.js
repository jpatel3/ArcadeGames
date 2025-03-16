// Word Explorer - Word Data
// Contains all the crossword puzzles for each level with progressive difficulty

const LEVELS = [
    // Level 1: Simple CVC words (cat, dog, sun)
    {
        id: 1,
        title: "Easy CVC Words",
        description: "Simple three-letter words",
        grid: {
            rows: 5,
            cols: 5,
            data: [
                [null, "S", "T", null, null],
                [null, "U", "C", "T", null],
                [null, "N", "A", "O", null],
                [null, null, "T", "P", null],
                [null, null, "D", "O", "G"]
            ]
        },
        words: [
            {
                id: 1,
                word: "CAT",
                clue: "A furry pet that says meow",
                direction: "down",
                row: 1,
                col: 2,
                image: "cat.png"
            },
            {
                id: 2,
                word: "SUN",
                clue: "It shines in the sky during the day",
                direction: "down",
                row: 0,
                col: 1,
                image: "sun.png"
            },
            {
                id: 3,
                word: "TOP",
                clue: "The opposite of bottom",
                direction: "down",
                row: 1,
                col: 3,
                image: "top.png"
            },
            {
                id: 4,
                word: "DOG",
                clue: "A pet that barks",
                direction: "across",
                row: 4,
                col: 2,
                image: "dog.png"
            }
        ],
        hintsAllowed: 3
    },

    // Level 2: More CVC words
    {
        id: 2,
        title: "More CVC Words",
        description: "Fun three-letter words",
        grid: {
            rows: 5,
            cols: 5,
            data: [
                [null, null, null, null, null],
                [null, "B", "A", "T", null],
                [null, "I", null, "G", null],
                [null, "N", null, "U", null],
                ["P", "I", "G", "M", null]
            ]
        },
        words: [
            {
                id: 1,
                word: "BAT",
                clue: "A flying animal that comes out at night",
                direction: "across",
                row: 1,
                col: 1,
                image: "bat.png"
            },
            {
                id: 2,
                word: "GUM",
                clue: "You chew it but don't swallow it",
                direction: "down",
                row: 2,
                col: 3,
                image: "gum.png"
            },
            {
                id: 3,
                word: "PIG",
                clue: "A pink farm animal that says oink",
                direction: "across",
                row: 4,
                col: 0,
                image: "pig.png"
            },
            {
                id: 4,
                word: "BIN",
                clue: "You put trash in it",
                direction: "down",
                row: 1,
                col: 1,
                image: "bin.png"
            }
        ],
        hintsAllowed: 3
    },

    // Level 3: More CVC words with some intersections
    {
        id: 3,
        title: "CVC Word Fun",
        description: "More three-letter words",
        grid: {
            rows: 5,
            cols: 5,
            data: [
                ["F", "O", "X", null, null],
                ["A", null, null, null, null],
                ["N", "B", "U", "G", null],
                [null, "U", null, "J", null],
                [null, "N", "J", "A", "M"]
            ]
        },
        words: [
            {
                id: 1,
                word: "FOX",
                clue: "A clever wild animal with a bushy tail",
                direction: "across",
                row: 0,
                col: 0,
                image: "fox.png"
            },
            {
                id: 2,
                word: "BUG",
                clue: "A small crawling insect",
                direction: "across",
                row: 2,
                col: 1,
                image: "bug.png"
            },
            {
                id: 3,
                word: "JAM",
                clue: "Sweet spread made from fruit",
                direction: "across",
                row: 4,
                col: 2,
                image: "jam.png"
            },
            {
                id: 4,
                word: "FAN",
                clue: "It blows air to keep you cool",
                direction: "down",
                row: 0,
                col: 0,
                image: "fan.png"
            },
            {
                id: 5,
                word: "BUN",
                clue: "A small round bread roll",
                direction: "down",
                row: 2,
                col: 1,
                image: "bun.png"
            }
        ],
        hintsAllowed: 3
    },

    // Level 4: Simple 4-letter words
    {
        id: 4,
        title: "Four Letter Words",
        description: "Simple four-letter words",
        grid: {
            rows: 6,
            cols: 6,
            data: [
                [null, null, 1, null, null, null],
                [null, null, "F", null, null, null],
                [2, "J", "U", "M", "P", null],
                [null, null, "N", null, null, null],
                [3, "S", "T", "A", "R", null],
                [null, null, null, null, null, null]
            ]
        },
        words: [
            {
                id: 1,
                word: "FUN",
                clue: "Something that makes you happy",
                direction: "down",
                row: 0,
                col: 2,
                image: "fun.png"
            },
            {
                id: 2,
                word: "JUMP",
                clue: "To push yourself off the ground",
                direction: "across",
                row: 2,
                col: 0,
                image: "jump.png"
            },
            {
                id: 3,
                word: "STAR",
                clue: "A bright light in the night sky",
                direction: "across",
                row: 4,
                col: 0,
                image: "star.png"
            }
        ],
        hintsAllowed: 3
    },

    // Level 5: More 4-letter words
    {
        id: 5,
        title: "More Four Letter Words",
        description: "Fun four-letter words",
        grid: {
            rows: 6,
            cols: 6,
            data: [
                [null, 1, null, null, null, null],
                [2, "F", "I", "S", "H", null],
                [null, "R", null, null, null, null],
                [null, "O", null, 3, null, null],
                [null, "G", null, "B", null, null],
                [null, null, null, "E", null, null],
                [null, null, null, "A", null, null],
                [null, null, null, "R", null, null]
            ]
        },
        words: [
            {
                id: 1,
                word: "FROG",
                clue: "A green animal that jumps and lives near water",
                direction: "down",
                row: 0,
                col: 1,
                image: "frog.png"
            },
            {
                id: 2,
                word: "FISH",
                clue: "An animal that swims in water",
                direction: "across",
                row: 1,
                col: 0,
                image: "fish.png"
            },
            {
                id: 3,
                word: "BEAR",
                clue: "A big furry animal that likes honey",
                direction: "down",
                row: 3,
                col: 3,
                image: "bear.png"
            }
        ],
        hintsAllowed: 3
    },

    // Level 6: Mix of 3 and 4-letter words
    {
        id: 6,
        title: "Mixed Words",
        description: "Mix of three and four-letter words",
        grid: {
            rows: 6,
            cols: 6,
            data: [
                [1, "B", "O", "A", "T", null],
                [null, null, null, null, "R", null],
                [null, 2, null, null, "E", null],
                [null, "C", "A", "K", "E", null],
                [3, "P", "E", "N", null, null],
                [null, null, null, null, null, null]
            ]
        },
        words: [
            {
                id: 1,
                word: "BOAT",
                clue: "It floats on water",
                direction: "across",
                row: 0,
                col: 0,
                image: "boat.png"
            },
            {
                id: 2,
                word: "CAKE",
                clue: "A sweet dessert for birthdays",
                direction: "across",
                row: 3,
                col: 1,
                image: "cake.png"
            },
            {
                id: 3,
                word: "PEN",
                clue: "You write with it",
                direction: "across",
                row: 4,
                col: 0,
                image: "pen.png"
            },
            {
                id: 4,
                word: "TREE",
                clue: "It has leaves and grows tall",
                direction: "down",
                row: 0,
                col: 4,
                image: "tree.png"
            }
        ],
        hintsAllowed: 3
    },

    // Continue with more levels...
    // Level 7: Five-letter words
    {
        id: 7,
        title: "Five Letter Words",
        description: "Simple five-letter words",
        grid: {
            rows: 7,
            cols: 7,
            data: [
                [null, null, null, 1, null, null, null],
                [null, null, null, "T", null, null, null],
                [null, null, null, "I", null, null, null],
                [2, "W", "A", "G", "O", "N", null],
                [null, null, null, "E", null, null, null],
                [3, "S", "H", "E", "E", "P", null],
                [null, null, null, "R", null, null, null]
            ]
        },
        words: [
            {
                id: 1,
                word: "TIGER",
                clue: "A big striped cat",
                direction: "down",
                row: 0,
                col: 3,
                image: "tiger.png"
            },
            {
                id: 2,
                word: "WAGON",
                clue: "A cart with four wheels that you can pull",
                direction: "across",
                row: 3,
                col: 0,
                image: "wagon.png"
            },
            {
                id: 3,
                word: "SHEEP",
                clue: "A farm animal with wool",
                direction: "across",
                row: 5,
                col: 0,
                image: "sheep.png"
            }
        ],
        hintsAllowed: 4
    },

    // Level 8: More five-letter words
    {
        id: 8,
        title: "More Five Letter Words",
        description: "Fun five-letter words",
        grid: {
            rows: 7,
            cols: 7,
            data: [
                [null, null, 1, null, null, null, null],
                [null, null, "P", null, null, null, null],
                [2, "L", "A", "K", "E", null, null],
                [null, null, "P", null, null, null, null],
                [null, null, "E", null, 3, null, null],
                [null, null, "R", null, "C", null, null],
                [4, "H", "O", "U", "S", "E", null]
            ]
        },
        words: [
            {
                id: 1,
                word: "PAPER",
                clue: "You write on it",
                direction: "down",
                row: 0,
                col: 2,
                image: "paper.png"
            },
            {
                id: 2,
                word: "LAKE",
                clue: "A large area of water surrounded by land",
                direction: "across",
                row: 2,
                col: 0,
                image: "lake.png"
            },
            {
                id: 3,
                word: "CLOUD",
                clue: "White fluffy thing in the sky",
                direction: "down",
                row: 4,
                col: 4,
                image: "cloud.png"
            },
            {
                id: 4,
                word: "HOUSE",
                clue: "A building where people live",
                direction: "across",
                row: 6,
                col: 0,
                image: "house.png"
            }
        ],
        hintsAllowed: 4
    },

    // Level 9: Mix of 4 and 5-letter words
    {
        id: 9,
        title: "Mixed Longer Words",
        description: "Mix of four and five-letter words",
        grid: {
            rows: 7,
            cols: 7,
            data: [
                [1, "B", "R", "A", "I", "N", null],
                [null, null, null, null, null, null, null],
                [2, "M", "O", "O", "N", null, null],
                [null, null, null, null, null, null, null],
                [3, "S", "W", "I", "M", null, null],
                [null, null, null, null, null, null, null],
                [4, "F", "L", "O", "W", "E", "R"]
            ]
        },
        words: [
            {
                id: 1,
                word: "BRAIN",
                clue: "It's in your head and helps you think",
                direction: "across",
                row: 0,
                col: 0,
                image: "brain.png"
            },
            {
                id: 2,
                word: "MOON",
                clue: "It shines in the night sky",
                direction: "across",
                row: 2,
                col: 0,
                image: "moon.png"
            },
            {
                id: 3,
                word: "SWIM",
                clue: "Moving through water using your arms and legs",
                direction: "across",
                row: 4,
                col: 0,
                image: "swim.png"
            },
            {
                id: 4,
                word: "FLOWER",
                clue: "A colorful plant that grows from a seed",
                direction: "across",
                row: 6,
                col: 0,
                image: "flower.png"
            }
        ],
        hintsAllowed: 4
    },

    // Level 10: Six-letter words
    {
        id: 10,
        title: "Six Letter Words",
        description: "Simple six-letter words",
        grid: {
            rows: 8,
            cols: 8,
            data: [
                [null, null, null, null, null, null, null, null],
                [1, "G", "A", "R", "D", "E", "N", null],
                [null, null, null, null, null, null, null, null],
                [null, null, 2, null, null, null, null, null],
                [null, null, "R", null, null, null, null, null],
                [null, null, "A", null, null, null, null, null],
                [3, "B", "U", "T", "T", "O", "N", null],
                [null, null, "B", null, null, null, null, null],
                [null, null, "I", null, null, null, null, null],
                [null, null, "T", null, null, null, null, null]
            ]
        },
        words: [
            {
                id: 1,
                word: "GARDEN",
                clue: "An area where plants and flowers grow",
                direction: "across",
                row: 1,
                col: 0,
                image: "garden.png"
            },
            {
                id: 2,
                word: "RABBIT",
                clue: "A furry animal with long ears that hops",
                direction: "down",
                row: 3,
                col: 2,
                image: "rabbit.png"
            },
            {
                id: 3,
                word: "BUTTON",
                clue: "You press it to turn something on or off",
                direction: "across",
                row: 6,
                col: 0,
                image: "button.png"
            }
        ],
        hintsAllowed: 4
    }

    // Additional levels would continue here...
];

// Export the levels data
const WordData = {
    levels: LEVELS,
    totalLevels: LEVELS.length
};

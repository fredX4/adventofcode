import fs from 'fs/promises';

export default async function () {
    let part_1 = 1, part_2 = 0;
    let outputString = '';

    // read input data
    let inputData = (await fs.readFile(`${__dirname}/input.txt`)).toString().split('\n').map(line => line.split(''));

    enum Direction {
        Up,
        Right,
        Down,
        Left
    }

    let direction = Direction.Up;
    let guardPosition: { row: number, col: number } = { row: 0, col: 0 };
    let obstructionPositions: { row: number, col: number }[] = [];

    const printMatrix = () => {
        let index = 0;
        console.log('  0 1 2 3 4 5 6 7 8 9');
        for(let line of inputData) {
            console.log(index++ + ' ' + line.join(' '));
        }
        console.log('\n-------------\n')
    }

    const storeObstructionPosition = (row: number, col: number) => {
        if (!obstructionPositions.find(position => position.row === row && position.col === col)) {
            obstructionPositions.push({ row, col });
        }
    }

    // move in the same direction
    let storeObstruction = true;
    const move = (onlyFetch = false): { row: number, col: number } | void => {
        const { row, col} = guardPosition;
        if (!onlyFetch) {
            inputData[row][col] = "X";
            if (storeObstruction) storeObstructionPosition(row, col);
            // printMatrix();
        }

        let updatedRow = row, updatedColumn = col;
        if (direction === Direction.Up) {
            updatedRow = guardPosition.row - 1;
        } else if (direction === Direction.Right) {
            updatedColumn = guardPosition.col + 1;
        } else if (direction === Direction.Down) {
            updatedRow = guardPosition.row + 1;
        } else {
            updatedColumn = guardPosition.col - 1;
        }

        if (onlyFetch) {
            return { row: updatedRow, col: updatedColumn };
        } else guardPosition = { row: updatedRow, col: updatedColumn };
    }

    // make a turn
    const turn = () => {
        direction = direction === Direction.Left ? Direction.Up : direction + 1;
    }

    // find initial position of guard
    let initialPosition: { row: number, col: number };
    for (let row = 0; row < inputData.length; row++) {
        for (let col = 0; col < inputData[row].length; col++) {
            if (inputData[row][col] === "^") {
                initialPosition = { row, col };
                guardPosition = initialPosition
                break;
            }
        }
    }

    //start traversing till an exit is found
    let exitFound = false;
    while (!exitFound) {
        const nextElementPosition = move(true);
        const nextElement = inputData[nextElementPosition!.row][nextElementPosition!.col];
        if (nextElement === "#") turn();
        else if (nextElement === "." || nextElement === "X") {
            // move first
            move();

            //check if edge has reached
            const { row, col } = guardPosition;
            const isEdge = row === 0 || row === inputData.length - 1 || col === 0 || col === inputData.length - 1;
            exitFound = isEdge;
        }
    }

    //print traversed map
    outputString += inputData.map(line => line.join('')).join("\n");

    // write output to file
    await fs.writeFile(`${__dirname}/output.txt`, outputString);

    // part 1 - find distinct number of steps taken
    inputData.forEach(line => line.forEach(subline => part_1 += subline === "X" ? 1 : 0));

    return { part_1, part_2 };
}

import fs from 'fs/promises';

export default async function () {
    let part_1 = 0, part_2 = 0;

    const inputData = (await fs.readFile(`${__dirname}/input.txt`)).toString();

    // calculate count of string matches
    const calculateStringCount = (input: string, queryString: string) => input.match(new RegExp(queryString, 'gm'))?.length || 0;

    // scan forward and backward
    part_1 += calculateStringCount(inputData, 'XMAS') + calculateStringCount(inputData, 'SAMX');

    // convert data into a 2D array
    const inputMatrix = inputData.split('\n').map(inputLine => inputLine.split(''));

    // transpose the matrix to scan from top and bottom
    const transposedMatrix = inputMatrix[0].map((_, colIndex) => inputMatrix.map(row => row[colIndex]));
    transposedMatrix.forEach(line => {
        const lineString = line.join('');
        part_1 += calculateStringCount(lineString, 'XMAS') + calculateStringCount(lineString, 'SAMX');
    });

    // calculate left diagonals
    const getLeftDiagonals = (matrix: string[][]): string[][] => {
        const diagonals: string[][] = [];

        // Get diagonals starting from the first row
        for (let col = 0; col < matrix[0].length; col++) {
            const diagonal: string[] = [];
            for (let row = 0, colIndex = col; row < matrix.length && colIndex >= 0; row++, colIndex--) {
                diagonal.push(matrix[row][colIndex]);
            }
            diagonals.push(diagonal);
        }

        // Get diagonals starting from the last column (excluding the first element)
        for (let row = 1; row < matrix.length; row++) {
            const diagonal: string[] = [];
            for (let rowIndex = row, col = matrix[0].length - 1; rowIndex < matrix.length && col >= 0; rowIndex++, col--) {
                diagonal.push(matrix[rowIndex][col]);
            }
            diagonals.push(diagonal);
        }

        return diagonals;
    };

    // calculate right diagonals
    const getRightDiagonals = (matrix: string[][]): string[][] => {
        const diagonals: string[][] = [];

        // Get diagonals starting from the first row
        for (let col = 0; col < matrix[0].length; col++) {
            const diagonal: string[] = [];
            for (let row = 0, colIndex = col; row < matrix.length && colIndex < matrix[0].length; row++, colIndex++) {
                diagonal.push(matrix[row][colIndex]);
            }
            diagonals.push(diagonal);
        }

        // Get diagonals starting from the first column (excluding the first element)
        for (let row = 1; row < matrix.length; row++) {
            const diagonal: string[] = [];
            for (let rowIndex = row, col = 0; rowIndex < matrix.length && col < matrix[0].length; rowIndex++, col++) {
                diagonal.push(matrix[rowIndex][col]);
            }
            diagonals.push(diagonal);
        }

        return diagonals;
    };

    // scan left and right diagonals
    [
        getLeftDiagonals(inputMatrix),
        getRightDiagonals(inputMatrix)

    ].forEach(diagonals => {
        diagonals.forEach(line => {
            const lineString = line.join('');

            //part 1 - calculate count of string `XMAS`
            part_1 += calculateStringCount(lineString, 'XMAS') + calculateStringCount(lineString, 'SAMX');
        });
    });

    const isXmasMatrix = (inputMatrix: string[][]) => {
        const leftDiagonalString = `${inputMatrix[0][0]}${inputMatrix[1][1]}${inputMatrix[2][2]}`;
        const rightDiagonalString = `${inputMatrix[0][2]}${inputMatrix[1][1]}${inputMatrix[2][0]}`;
        const validStrings = ['MAS', 'SAM'];

        return validStrings.includes(leftDiagonalString) && validStrings.includes(rightDiagonalString);
    };

    for (let i = 0; i <= inputMatrix.length - 3; i++) {
        for (let j = 0; j <= inputMatrix[0].length - 3; j++) {
            const _3x3Matrix = inputMatrix.slice(i, i + 3).map(row => row.slice(j, j + 3));

            // part 2 - check for count of `X-MAS` matrix pattern
            if (isXmasMatrix(_3x3Matrix)) {
                part_2++;
            }
        }
    }


    return { part_1, part_2 };
}

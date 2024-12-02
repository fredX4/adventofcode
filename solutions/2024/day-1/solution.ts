import fs from 'fs/promises';

export default async function () {
    let part_1, part_2;

    // read input data
    const input = ((await fs.readFile(`${__dirname}/input.txt`)).toString());

    // insertion sort
    const pushDown = (value: number, array: number[]): number[] => {
        if (array.length === 0) {
            array.push(value);
            return array;
        } else {
            for (let index = 0; index <= array.length; index++) {
                if (value > array[index]) {
                    return array.slice(0, index + 1).concat(pushDown(value, array.slice(index + 1)));
                } else {
                    array.splice(index, 0, value);
                    return array;
                }
            }

            return array;
        }
    }

    let firstSortedValues: number[] = [];
    let secondSortedValues: number[] = [];

    const inputLines = input.split('\n');
    inputLines.forEach(line => {
        const [firstValue, secondValue] = line.split('   ').map(value => parseInt(value));
        firstSortedValues = pushDown(firstValue, firstSortedValues);
        secondSortedValues = pushDown(secondValue, secondSortedValues);
    });

    // part 1 - sum of absolute differences after sort
    part_1 = firstSortedValues.reduce((sum, firstValue, index) => {
        return sum + Math.abs(firstValue - secondSortedValues[index]);
    }, 0);

    const findCount = (value: number, array: number[]): number => {
        let count = 0;
        array.forEach(element => {
            if (element === value) count++;
        })

        return count;
    };

    // part 2 - find similarity score
    part_2 = firstSortedValues.reduce((score, firstValue) => {
        return score + (firstValue * findCount(firstValue, secondSortedValues));
    }, 0);

    return { part_1, part_2 };
}
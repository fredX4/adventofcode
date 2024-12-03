import fs from 'fs/promises';

export default async function () {
    let part_1 = 0, part_2 = 0;

    // read input data
    const inputData = (await fs.readFile(`${__dirname}/input.txt`)).toString();

    // find product from `mul(x,y)` sequence
    const findProduct = (sequence: string): number => {
        return sequence.match(/\d+/g)
            ?.map(match => parseInt(match))
            .reduce((product, value) => product * value, 1) as number;
    }

    // part 1 - find sum of valid `mul` operations
    inputData.match(/(mul\(\d+,\d+\))/g)?.forEach(sequence => {
        part_1 += findProduct(sequence);
    })

    // part 2 - find sum of `mul` operations following conditions
    let doSequenceActive = true;
    inputData.match(/(mul\(\d+,\d+\))|(don't\(\))|(do\(\))/g)?.forEach(sequence => {
        if (sequence !== "don't()" && sequence !== "do()" && doSequenceActive) {
            part_2 += findProduct(sequence);
        } else if (sequence === "do()") {
            doSequenceActive = true;
        } else if (sequence === "don't()") {
            doSequenceActive = false;
        }
    });

    return { part_1, part_2 };
}

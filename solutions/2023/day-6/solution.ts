import fs from 'fs/promises';

function toNumbers (arrayString: string) {
    return arrayString.split(' ').map(seed => +seed).filter(Number);
};

export default async function () {
    //read input data
    const inputSheet = ((await fs.readFile(`${__dirname}/input.txt`)).toString()).split('\n');

    //initialise result
    let result = 0;

    //parse time and distance
    const timeMatch = inputSheet[0].match(/Time:\s+([\d\s]+)/);
    const distanceMatch = inputSheet[1].match(/Distance:\s+([\d\s]+)/);
    let timeData = timeMatch ? toNumbers(timeMatch[1]) : [];
    let distanceData = distanceMatch ? toNumbers(distanceMatch[1]) : [];

    //start with the middle element and work your way till the distance is not beaten
    result = timeData.reduce((result, availableTime, index) => {
        const distanceToBeat = distanceData[index];
        const isEvenTime = availableTime % 2 !== 0;
        const middle = Math.ceil(availableTime / 2);
        let numberOfOptions = 0;

        for (let i = middle, j = isEvenTime ? middle - 1 : middle; i <= availableTime; i++, j--) {
            numberOfOptions = i * j > distanceToBeat ? numberOfOptions + 1 : numberOfOptions * 2;
            if (i * j <= distanceToBeat) break;
        }

        numberOfOptions = !isEvenTime ? numberOfOptions - 1 : numberOfOptions;
        result *= numberOfOptions;
        return result;
    }, 1);

    //return result
    return { part_1: result, part_2: result };
}

import fs from 'fs/promises';

function isNumber (character: string) {
    return !isNaN(parseInt(character));
};

function isSymbol (character: string) {
    return character !== '.' && !isNumber(character);
};

export default async function () {
    let part_1 = 0, part_2 = 0;

    //read input data
    const inputData = ((await fs.readFile(`${__dirname}/input.txt`)).toString()).split('\n');

    //initialise schematic and result
    const schematic: string[][] = [];

    //fetch part number
    function fetchPartNumber (lineIndex: number, symbolIndex: number) {
        let number = schematic[lineIndex][symbolIndex];
        let start;
        let end;

        if (isNumber(number)) {
            const scanDirection = (direction: number) => {
                let index = symbolIndex + direction;
                while (isNumber(schematic[lineIndex][index])) {
                    number = direction === 1 ? number + schematic[lineIndex][index] : schematic[lineIndex][index] + number;
                    index += direction;
                }
                return index -= direction;
            };

            start = scanDirection(-1); // Scan left
            end = scanDirection(1); // Scan right
        }

        return {
            number: parseInt(number),
            lineIndex,
            start,
            end
        };
    }

    interface PartNumber {
        number: number;
        lineIndex: number;
        start?: number;
        end?: number;
        symbol?: string;
        symbolIndex: number;
        symbolLineIndex: number;
    };

    //record distinct part number
    const partNumbers: PartNumber[] = [];
    function recordPartNumbers (lineIndex: number, symbolIndex: number, symbol: string) {
        [
            fetchPartNumber(lineIndex, symbolIndex - 1),         //left
            fetchPartNumber(lineIndex, symbolIndex + 1),         //right
            fetchPartNumber(lineIndex - 1, symbolIndex),         //top
            fetchPartNumber(lineIndex + 1, symbolIndex),         //bottom
            fetchPartNumber(lineIndex - 1, symbolIndex - 1),     //top-left
            fetchPartNumber(lineIndex - 1, symbolIndex + 1),     //top-right
            fetchPartNumber(lineIndex + 1, symbolIndex - 1),     //bottom-left
            fetchPartNumber(lineIndex + 1, symbolIndex + 1)      //bottom-right
        ].forEach(partNumberInfo => {
            if (
                !partNumbers.find(
                    numberInfo =>
                    numberInfo.lineIndex === partNumberInfo.lineIndex &&
                    numberInfo.start === partNumberInfo.start &&
                    numberInfo.end === partNumberInfo.end
                )
            ) {
                partNumbers.push({ symbol, symbolIndex, symbolLineIndex: lineIndex, ...partNumberInfo });
            }
        })
    };

    //read schematic
    inputData.forEach(schemeLine => schematic.push(schemeLine.split('')));
    schematic.forEach((schemeLine, lineIndex) => {
        schemeLine.forEach((character, characterIndex) => {
            if (isSymbol(character)) {
                recordPartNumbers(lineIndex, characterIndex, character)
            }
        });
    });

    interface GearInfo {
        gearRatio: number,
        gearCount: number
    }

    const gearInfo = partNumbers
        .filter(partNumberInfo => partNumberInfo.symbol === '*')
        .reduce((gearInfo, partNumberInfo) => {
            let gearId = `${partNumberInfo.symbolIndex} | ${partNumberInfo.symbolLineIndex}`;
            if (!gearInfo[gearId]) {
                gearInfo[gearId] = {
                    gearCount: 1,
                    gearRatio: partNumberInfo.number
                };
            } else {
                gearInfo[gearId].gearCount++;
                gearInfo[gearId].gearRatio *= partNumberInfo.number;
            }

            return gearInfo;
        }, {} as Record<string, GearInfo>);

    //Part 1 - sum of part numbers
    part_1 = partNumbers.reduce((sum, numberInfo) => sum += numberInfo.number, 0);

    //Part 2 - sum of gear ratios
    part_2 = Object.values(gearInfo).reduce((sum, gear) => {
        if (gear.gearCount === 2) sum += gear.gearRatio;
        return sum;
    }, 0);

    //return result
    return { part_1, part_2 };
}

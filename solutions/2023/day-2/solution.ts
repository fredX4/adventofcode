import fs from 'fs/promises';

interface GameData {
    red: number;
    green: number;
    blue: number;
    id: number;
}

function parseGameData (gameString: string): GameData {
    return {
        id: parseInt(gameString.match(/(\d+):/g)![0]?.slice(0, -1)),
        ...parseColorInfo(gameString.split(';'))
    };
}

function parseColorInfo (gameSets: string[]) {
    const colorInfo = { red: 0, green: 0, blue: 0 };

    gameSets.forEach(gameSet => {
        gameSet.match(/(\d+ blue)|(\d+ red)|(\d+ green)/g)!.forEach(colorString => {
            let colorParts = colorString.split(' ');
            let colorValue = parseInt(colorParts[0]);
            let colorName = colorParts[1] as keyof typeof colorInfo;

            colorInfo[colorName] = colorValue >= colorInfo[colorName] ? colorValue : colorInfo[colorName];
        });
    });

    return colorInfo;
}

export default async function () {
    let part_1, part_2;

    //read input data
    const inputData = ((await fs.readFile(`${__dirname}/input.txt`)).toString()).split('\n');

    //initialise output string
    let outputString = '';
    let result = 0;

    //prepare game data
    const gameData: GameData[] = [];
    inputData.forEach(gameString => {
        let parsedGameData = parseGameData(gameString);
        gameData.push(parsedGameData)
        outputString += `${gameString} | red: ${parsedGameData.red}, green: ${parsedGameData.green}, blue: ${parsedGameData.blue}\n`
    });

    // Part 1 Solution
    part_1 = gameData
        .filter(game => {
            return game.red <= 12 && game.green <= 13 && game.blue <= 14
        })
        .reduce((sum, game) => sum += game.id, 0);

    //Part 2 Solution
    part_2 = gameData.reduce((sum, game) => sum += (game.red * game.green * game.blue), 0);

    //write output to file
    outputString += `\n---\nSum: ${result}`;
    await fs.writeFile(`${__dirname}/output.txt`, outputString);

    //return result
    return { part_1, part_2 };
}

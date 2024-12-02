import fs from 'fs/promises';

function toNumbers (arrayString: string) {
    return arrayString.split(' ').map(seed => +seed);
};

export default async function () {
    let part_1, part_2;

    //read input data, prepare map store
    const alamanc = ((await fs.readFile(`${__dirname}/input.txt`)).toString());
    const categories = [
        'seed-to-soil',
        'soil-to-fertilizer',
        'fertilizer-to-water',
        'water-to-light',
        'light-to-temperature',
        'temperature-to-humidity',
        'humidity-to-location'
    ];

    interface Map {
        start: number;
        rangeLength: number;
        end?: number;
        destinationStart?: number;
    }
    const mapStore: Record<string, Map[]> = {};

    //update mappings
    function updateMap (category: string, listing: string) {
        let [ destinationStart, start, rangeLength ] = toNumbers(listing);
        mapStore[category].push({ start, rangeLength, end: start + rangeLength - 1, destinationStart });
        mapStore[category].sort((firstItem, secondItem) => firstItem.start - secondItem.start);
    };

    //extract listings
    function extractListings (listings: string[]) {
        return listings[1].split('\n').reduce((filteredListings, listing) => {
            if (listing.length) filteredListings.push(listing);
            return filteredListings;
        }, [] as string[]);
    };

    //find lowest value from a range of values
    function findLowestValueInRange (range: Map[]) {
        return range.reduce((value, { start }) => Math.min(start, value), Number.MAX_VALUE);
    };

    //converts source ranges to destination ranges
    function findDestinationRanges (range: Map, category: string, resultSets: Map[]) {
        let remainingLength = range.rangeLength;

        while (remainingLength > 0) {
            for (const { start, end, destinationStart } of mapStore[category]) {
                const realEnd = range.start + remainingLength - 1;
                const offset = range.start - start;
                const overlapEnd = Math.min(realEnd, end!);
                const usedLength = overlapEnd - range.start;

                if (remainingLength > 0 && range.start <= end!) {
                    if ((range.start >= start && realEnd <= end!) || (range.start >= start && realEnd >= end!)) {
                        resultSets.push({
                            start: destinationStart! + offset,
                            rangeLength: usedLength + 1,
                            end: destinationStart! + offset + usedLength,
                        });
                        remainingLength = realEnd - overlapEnd;
                        range.start += usedLength + 1;
                    }
                }
            }

            if (remainingLength > 0) {
                resultSets.push({
                    start: range.start,
                    rangeLength: remainingLength,
                    end: range.start + remainingLength - 1,
                });
                remainingLength = 0;
            }
        }
    };

    //finds lowest location for the seed ranges
    function findLowestSeedLocation (seedRanges: Map[]) {
        return seedRanges.reduce((minValue: number, seedRange: Map) => {
            let categoryResults: Map[] = [seedRange];

            for (const category of categories) {
                categoryResults = categoryResults.reduce((resultSets, range) => {
                    findDestinationRanges(range, category, resultSets);
                    return resultSets;
                }, []);
            }

            const lowestCategoryValue = findLowestValueInRange(categoryResults);
            return Math.min(lowestCategoryValue, minValue || lowestCategoryValue);
        }, Number.MAX_VALUE);
    };

    //fetch seeds and form maps
    let seeds = toNumbers(alamanc.match(/seeds: (\d+\s+.*)/)![1]);

    //form category mappings
    categories.forEach(category => {
        mapStore[category] = [];
        let categoryListings = alamanc.match(new RegExp(`${category} map:\n((\\d*\\s*)*)\n*`));
        extractListings(categoryListings!).forEach(listing => updateMap(category, listing));

        //add negative ranges if required
        let initialCategoryLength = mapStore[category].length;
        for (let i = 0; i < initialCategoryLength - 1; i++) {
            let range = mapStore[category][i];
            //negative range in between
            let nextRangeStart = mapStore[category][i + 1]?.start;
            if (nextRangeStart !== undefined && nextRangeStart !== range.end! + 1) {
                let start = range.end! + 1;
                let rangeLength = nextRangeStart - range.end! - 1;
                mapStore[category].push({
                    start,
                    rangeLength,
                    end: start + rangeLength - 1,
                    destinationStart: start
                })
            }
        }
        mapStore[category].sort((firstItem, secondItem) => firstItem.start - secondItem.start);

        //negative range at the beginning
        if (mapStore[category][0].start !== 0) {
            mapStore[category].unshift({
                start: 0,
                rangeLength: mapStore[category][0].start,
                end: mapStore[category][0].start - 1,
                destinationStart: 0
            })
        }
    });

    //Part 1 - all numbers are seeds
    let seedRanges: Map[] = [];
    seeds.forEach(seed => seedRanges.push({ start: seed, rangeLength: 1 }));
    part_1 = findLowestSeedLocation(seedRanges);

    //Part 2 - every alternate number indicates range length
    seedRanges = [];
    seeds.forEach((seed, index) => {
        if (index %2 !== 0) seedRanges.push({ start: seeds.at(index - 1) as number, rangeLength: seed });
    });
    part_2 = findLowestSeedLocation(seedRanges);

    //return result
    return { part_1, part_2 };
}

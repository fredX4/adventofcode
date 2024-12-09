import fs from 'fs/promises';

export default async function () {
    let part_1 = 0, part_2 = 0;

    // read input data
    const inputData = (await fs.readFile(`${__dirname}/input.txt`)).toString().split('\n\n');

    //extract rules and updates
    const rules = inputData[0].split('\n');
    const updates = inputData[1].split('\n');

    const ruleMap: Map<string, { before: string[], after: string[] }> = new Map();

    rules.forEach(ruleString => {
        const [ beforeValue, afterValue ] = ruleString.split('|');

        // add rule for before value
        if (!ruleMap.get(beforeValue)) {
            ruleMap.set(beforeValue, {
                before: [ afterValue ],
                after: []
            })
        } else {
            const existingRule = ruleMap.get(beforeValue);
            existingRule?.before.push(afterValue);
        }

        // add rule for before value
        if (!ruleMap.get(afterValue)) {
            ruleMap.set(afterValue, {
                before: [],
                after: [ beforeValue ]
            })
        } else {
            const existingRule = ruleMap.get(afterValue);
            existingRule?.after.push(beforeValue);
        }
    });

    // check if element is in order at the specified index
    const isElementInOrder = (index: number, array: string[]) => {
        const element = array[index];
        const rules = ruleMap.get(element);
        if (rules) {
            const beforeValues = array.slice(0, index);
            const afterValues = array.slice(index + 1);

            return afterValues.every(afterValue => !rules.after.includes(afterValue)) &&
            beforeValues.every(beforeValue => !rules.before.includes(beforeValue));
        } else return true;
    }

    const filterOrderValues = (updateString: string, negate: boolean = false) => {
        const updateValues = updateString.split(',');
        const isCorrectOrder = updateValues.every((element, index) => isElementInOrder(index, updateValues))

        return negate ? !isCorrectOrder : isCorrectOrder;
    }

    // part 1 - sum of middle numbers of correctly ordered numbers
    updates.filter(updateString => filterOrderValues(updateString)).forEach(validUpdateString => {
        const validUpdates = validUpdateString.split(',');
        part_1 += parseInt(validUpdates[Math.floor((validUpdates.length) / 2)]);
    });

    // part 2 - sum of middle numbers of inccorrectly ordered numbers after correcting
    updates.filter(updateString => filterOrderValues(updateString, true)).forEach(invalidUpdateString => {
        const invalidValues = invalidUpdateString.split(',');
        const correctedOrder: string[] = [];

        invalidValues.forEach((value, index) => {
            if (!isElementInOrder(index, invalidValues)) {
                let elementInOrder = false, idx = 0;
                while (!elementInOrder) {
                    elementInOrder = isElementInOrder(idx, correctedOrder.toSpliced(idx, 0, value));
                    idx++;
                }
                correctedOrder.splice(idx - 1, 0, value);
            } else correctedOrder.push(value);
        });

        part_2 += parseInt(correctedOrder[Math.floor((correctedOrder.length) / 2)]);
    });

    return { part_1, part_2 };
}

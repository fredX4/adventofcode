async function fetchSolution(currentYear: number, currentDay: number) {
    try {
        return await (await import(`./solutions/${currentYear}/day-${currentDay}/solution`)).default();
    } catch (err) {
        return { part_1: '🧑🏻‍💻', part_2: '🧑🏻‍💻' };
    }
};

(async () => {
    for (let currentDay = 1, currentYear = 2024; currentDay <= 25; currentDay++) {
        const { part_1, part_2 } = await fetchSolution(currentYear, currentDay);
        console.log(`Day ${currentDay}: Part 1: ${part_1} | Part 2: ${part_2}`);
    }
})();

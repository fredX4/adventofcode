import fs from 'fs/promises';

export default async function () {
    let part_1 = 0, part_2 = 0;
    let outputString = '';

    // read input data
    const reports = (await fs.readFile(`${__dirname}/input.txt`)).toString().split('\n');
    const isReportSafe = (report: number[]): boolean => {
        if (report[0] > report[1]) {
            report = report.reverse();
        }
        return report.every((value, index) => {
            if (index === report.length - 1) {
                return true;
            } else {
                const difference = report[index + 1] - value;
                return difference >= 1 && difference <= 3;
            }
        })
    }

    const isReportSafeWhenSpliced = (report: number[]): boolean => {
        if (isReportSafe(report)) {
            return true;
        }

        // start eliminating one element from the array and recheck
        return report.some((_, index) => {
            const adjustedReport = report.toSpliced(index, 1);
            return isReportSafe(adjustedReport);
        });
    }

    reports.forEach(reportString => {
        // part 1 - count number of safe reports
        const report = reportString.split(' ').map(report => parseInt(report));
        const safeReport = isReportSafe(report)
        part_1 = safeReport ? part_1 + 1 : part_1;

        // part 1 - count number of safe reports using dampener
        const safeReportWhenSpliced = isReportSafeWhenSpliced(report)
        part_2 = safeReportWhenSpliced ? part_2 + 1 : part_2;
        outputString += `${reportString} : ${safeReportWhenSpliced}\n`;
    });

    // write output to file
    await fs.writeFile(`${__dirname}/output.txt`, outputString);

    return { part_1, part_2 };
}
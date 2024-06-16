const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

const years = ['2019', '2020'];
const investmentTypes = ['Seed', 'Series A', 'Series B'];
const amounts = ['over 1M$', 'below 1M$'];
const fileName = './utils/startup-fundraising-2019-2020.csv'

async function filterAndWrite2CSV(srcFile, investType, amountCondition, years, merged = false) {
    const results = [];
    const yearLabel = merged ? years.join('-') : years[0];
    const basePath = path.resolve(__dirname, '..');
    const destName = `public/startup-fundraising-${investType.replace(/\s+/g, '-')}-${amountCondition.replace(/\s+/g, '-')}-${yearLabel}`;
    const dsName = destName.split('/').pop();

    const readStream = fs.createReadStream(srcFile)
        .pipe(csv())
        .on('data', (data) => {
            if (investmentTypes.includes(data['Investment Type']) && years.includes(data['Year'])) {
                const amount = Number(data['Amount(in USD)']);
                if ((amountCondition === 'over 1M$' && amount > 1000000) ||
                    (amountCondition === 'below 1M$' && amount <= 1000000)) {
                    results.push(data);
                }
            }
        });

    await new Promise(resolve => readStream.on('end', resolve));

    if (results.length > 0) {
        await writeCSV(results, path.join(basePath, `${destName}.csv`));
        await writeMarkdown(dsName, investType, amountCondition, years, path.join(basePath, `content/${dsName}/index.md`));
    } else {
        console.log(`No data matched for ${dsName}.csv. File not created.`);
    }
}

async function writeCSV(results, filePath) {
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: Object.keys(results[0]).map(key => ({ id: key, title: key }))
    });
    await csvWriter.writeRecords(results);
    console.log(`Data has been processed and saved to ${filePath}`);
}

async function writeMarkdown(dsName, investType, amountCondition, years, filePath) {
    const mdContent = `---
title: '${dsName}'
author: 'Almubdi Mutaikhan'
description: '${dsName}'
modified: '${new Date().toISOString().split('T')[0]}'
files: ['${dsName}.csv']
Investment type: ['${investType}']
Amount(USD): ['${amountCondition}']
Year: [${years.map(year => `'${year}'`).join(',')}]
---

[Go back](/)

# ${dsName}

## Table view of a dataset
<Table url="${dsName}.csv" />

## Flat UI table view of a dataset

<FlatUiTable
    url="${dsName}.csv"
/>

## Line chart of fundraising amount from 2015 to 2020
*This chart uses a separate dataset to give readers more picture to track the fundraising rate on a wider time scale.*

<LineChart
    title="Startup fundraising from 2015 to 2020"
    xAxis="Year"
    yAxis="Amount in USD"
    data="startup-fundraising-2015-2020.csv"
/>
`;
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, mdContent);
}

async function processAllDatasets() {
    const tasks = [];

    years.forEach(year => {
        investmentTypes.forEach(type => {
            amounts.forEach(amount => {
                tasks.push(filterAndWrite2CSV(fileName, type, amount, [year]));
            });
        });
    });

    investmentTypes.forEach(type => {
        amounts.forEach(amount => {
            tasks.push(filterAndWrite2CSV(fileName, type, amount, years, true));
        });
    });

    await Promise.all(tasks);
    console.log('All datasets have been processed.');
}

processAllDatasets().catch(error => {
    console.error('An error occurred:', error);
});

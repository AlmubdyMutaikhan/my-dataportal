const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');

async function processStartupFundraising(year) {
    const srcFile = `./utils/unprocessed/unprocessed-startup-fundraising-${year}.csv`;
    const destFile = `startup-fundraising-${year}.csv`;
    const results = [];

    const dataStream = fs.createReadStream(srcFile).pipe(csv());

    for await (const data of dataStream) {
        const processedData = processRow(data, year);
        results.push(processedData);
    }

    if (results.length > 0) {
        await write2CSV(destFile, results);
        console.log('Data has been processed');
    } else {
        console.log('Data is empty. CSV file won’t be processed');
    }
}

function processRow(data, year) {
    return {
        'Startup Name': data['Startup Name'],
        'Industry': data['Industry'],
        'SubVerticalIndustry': data['SubVerticalIndustry'],
        'City': data['City'],
        'Investor Name': data['Investor Name'],
        'Investment Type': data['Investment Type'],
        'Amount(in USD)': parseInt(data['Amount(in USD)'].replace(/[\$,]/g, ''), 10),
        'Year': year,
    };
}

async function write2CSV(filename, data) {
    const csvWriter = createObjectCsvWriter({
        path: filename,
        header: [
            {id: 'Year', title: 'Year'},
            {id: 'Startup Name', title: 'Startup Name'},
            {id: 'Industry', title: 'Industry'},
            {id: 'SubVerticalIndustry', title: 'SubVertical Industry'},
            {id: 'City', title: 'City'},
            {id: 'Investor Name', title: 'Investor Name'},
            {id: 'Investment Type', title: 'Investment Type'},
            {id: 'Amount(in USD)', title: 'Amount(in USD)'},
        ]
    });

    await csvWriter.writeRecords(data);
}


processStartupFundraising(2019);
processStartupFundraising(2020);

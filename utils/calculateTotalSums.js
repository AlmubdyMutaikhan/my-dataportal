const csv =  require('csv-parser')
const { createObjectCsvWriter } = require('csv-writer')
const fs = require('fs')


// Initialize parameters
const srcFile = 'startup-fundraising-from-2015-2020.csv'
const destFile = `startup-fundraising-2015-2020-parsed.csv`
const results = {}

fs.createReadStream(srcFile)
    .pipe(csv())
    .on('data', (data) => { 
            if(!results[data['Year']]) {
                results[data['Year']] = parseInt(data['Amount in USD'])
            } else {
                results[data['Year']] += parseInt(data['Amount in USD'])
            }   
    })
    .on('end', () => {
        console.log('data is parsed wholy')
        const data = Object.keys(results).map(key => ({
            Year: key,
            'Amount in USD': results[key]
          }));
        write2CSV(destFile, data)
})


function write2CSV(filename, data) {
    if(data.length === 0) {
        console.log('Data is empty. CSV file won\'t be processed')
        return
    }

    const csvWriter = createObjectCsvWriter({
        path: filename,
        header: [
            {id: 'Year', title: 'Year'},
            {id: 'Amount in USD', title: 'Amount in USD'},
          ]
    })

    csvWriter
            .writeRecords(data)
            .then(() => {
                console.log('Data has been processed')
            })
}


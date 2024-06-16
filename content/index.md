# Welcome to My Data Portal!

## Dataset Topic
Startup Fundraising in India Before and During the Pandemic

## Motivation
In the tech world, the startup industry plays a crucial role. I was curious about how fundraising dynamics might have changed due to the pandemic. To explore this, I found a comprehensive [dataset on Kaggle](https://www.kaggle.com/datasets/arpan129/startups-funding-dataset) that details startup fundraising activities in India.

## Note
The data for the years 2019 and 2020 differed in the structure of the CSV files. To standardize the dataset for analysis, I wrote several Node.js scripts. These scripts not only standardize the data but also create smaller, more manageable datasets based on specific filters. This data portal offers three main filtering options:
1. **Investment Type:** Options include Seed, Series A, Series B.
2. **Amount(USD):** Data can be filtered to show transactions over or under 1M$.
3. **Year of Fundraising:** Choose between the years 2019 and 2020.

## Usage
You can use the filters provided to search for and select datasets. Once a dataset is selected, the portal will display matching data in both table format and visualizations.


Below list of all available datasets:

<Catalog datasets={datasets} facets={['Investment type', 'Amount(USD)', 'Year']}
/>
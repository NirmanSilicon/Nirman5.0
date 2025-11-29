# Medicine Scraper Script

This script scrapes medicine data from Janaushadhi website and populates the database with only Janaushadhi medicines.

## Prerequisites

1. Install dependencies:
```bash
cd packages/backend
npm install puppeteer cheerio axios
```

2. Ensure your database is running and `.env` file is configured with database credentials.

## Usage

Run the scraper script:
```bash
npm run scrape:medicines
```

Or directly:
```bash
node scripts/scrape-medicines.js
```

## What it does

1. **Clears existing medicine data** - Removes all medicines, prices, and mappings from the database
2. **Scrapes Janaushadhi** - Extracts medicines from https://janaushadhivitran.com/
3. **Maps to symptoms/diseases** - Automatically maps medicines to relevant symptoms and diseases based on:
   - Medicine category
   - Medicine name patterns
   - Generic name recognition
5. **Populates database** - Inserts all scraped medicines with:
   - Medicine details (name, generic name, strength, form, packaging)
   - Prices from respective sources
   - Symptom mappings
   - Disease mappings

## Data Fields Extracted

- **Brand Name**: Medicine brand name
- **Generic Name**: Extracted from brand name
- **Price**: Current price in INR
- **Strength**: Dosage strength (e.g., 500mg, 10mg/5ml)
- **Form**: Tablet, Capsule, Syrup, etc.
- **Packaging**: Number of units (e.g., "10 Tablets", "100ml")
- **Category**: Medicine category
- **Manufacturer**: BPPI for Janaushadhi
- **Source**: "Janaushadhi"
- **Symptoms**: Automatically mapped based on category and medicine type
- **Diseases**: Automatically mapped based on category and medicine type

## Notes

- The scraper uses Puppeteer to handle dynamic content
- Rate limiting is implemented to avoid overwhelming the websites
- If scraping fails for a category, it continues with the next one
- The script limits to 10 pages per category to avoid excessive scraping

## Troubleshooting

1. **Puppeteer installation issues**: Make sure you have all system dependencies for Puppeteer
2. **Website structure changes**: If scraping fails, the website structure may have changed. Update selectors in the script.
3. **Database connection errors**: Check your `.env` file and database connection
4. **Timeout errors**: Increase timeout values in the script if websites are slow

## Important

- This script **clears all existing medicine data** before populating
- Only medicines from Janaushadhi source will be stored
- The medicine search API will automatically filter to show only Janaushadhi medicines


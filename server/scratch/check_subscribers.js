import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'D:/Debjani-web/server/.env' });

if (!process.env.GOOGLE_PRIVATE_KEY) {
  console.error('Error: GOOGLE_PRIVATE_KEY is not defined in .env');
  process.exit(1);
}

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function check() {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Subscribers'];
    if (!sheet) {
      console.log('No Subscribers sheet found.');
      return;
    }
    const rows = await sheet.getRows();
    console.log('Total Subscribers:', rows.length);
    rows.slice(-5).forEach(row => {
      console.log('-', row.get('Email'), 'at', row.get('Subscribed At'));
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

check();

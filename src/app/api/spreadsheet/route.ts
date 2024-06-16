import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

const ROW_KEY = 'ISU_ABBRV';

const getData = async (sheet: GoogleSpreadsheetWorksheet) => {
  // 형식 ex : { "대우건설": { "PBR": [1,2,3,], "EPS": [1,2,3] } }
  const data: Record<string, Record<string, unknown>> = {};

  const rows = await sheet.getRows();

  rows.forEach((row) => {
    if (!data[row.get(ROW_KEY) as string]) {
      data[row.get(ROW_KEY) as string] = {};
    }

    const rowObject = row.toObject();

    Object.entries(rowObject).forEach(([key, value]) => {
      if (!data[row.get(ROW_KEY) as string][key]) {
        data[row.get(ROW_KEY) as string][key] = [];
      }

      (data[row.get(ROW_KEY) as string][key] as unknown[]).push(value);
    });
  });

  return data;
};

export async function GET() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY!.split(String.raw`\n`).join('\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[2];

  const data = await getData(sheet);

  // for (const sheet of doc.sheetsByIndex) {
  // }

  return new Response(JSON.stringify(data));
}

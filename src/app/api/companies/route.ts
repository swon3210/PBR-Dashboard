import { companySchema } from '@/types/companies';

import { getItems } from '../db';

export async function GET() {
  const companies = (await getItems('companies')).map((item) => companySchema.parse(item));

  return new Response(JSON.stringify(companies));
}

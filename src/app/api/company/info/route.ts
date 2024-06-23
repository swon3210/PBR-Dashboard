import { getItem } from '../../db';

export async function GET(request: Request) {
  const companyName = new URL(request.url).searchParams.get('companyName');
  const targetInfo = new URL(request.url).searchParams.get('info');

  if (!companyName || !targetInfo) {
    return new Response('companyName and info are required', { status: 400 });
  }

  const item = await getItem(targetInfo.toUpperCase(), companyName);
}

// 출처
// http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC0201020502

import dayjs from 'dayjs';

export async function GET(request: Request) {
  // YYYY-MM-DD 의 형식으로 요청이 들어옴
  const targetDateString = new URL(request.url).searchParams.get('date')?.split('-').join('') ?? '';

  const today = dayjs();
  const oneWeekAgo = dayjs().subtract(1, 'week');
  const todayString = today.format('YYYYMMDD');
  const oneWeekAgoString = oneWeekAgo.format('YYYYMMDD');

  let data = {};

  try {
    const response = await fetch('http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd', {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
        cookie:
          '__smVisitorID=jPNSnZAVlQR; JSESSIONID=Xtm8NnPBf2samYf2e52fTQ04FKaQogr70h69zfn4d2y8Zp1bngjC1xpHrBJAs2Fg.bWRjX2RvbWFpbi9tZGNvd2FwMS1tZGNhcHAxMQ==',
        Referer: 'http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC0201020502',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: `bld=dbms/MDC/STAT/standard/MDCSTAT03501&locale=ko_KR&searchType=1&mktId=STK&trdDd=${targetDateString}&tboxisuCd_finder_stkisu0_0=024110%2F%EA%B8%B0%EC%97%85%EC%9D%80%ED%96%89&isuCd=KR7024110009&isuCd2=KR7024110009&codeNmisuCd_finder_stkisu0_0=%EA%B8%B0%EC%97%85%EC%9D%80%ED%96%89&param1isuCd_finder_stkisu0_0=ALL&strtDd=${todayString}&endDd=${oneWeekAgoString}&csvxls_isNo=false`,
      method: 'POST',
    });

    data = (await response.json()) as Record<string, unknown>;
  } catch (error) {
    console.log('초기화 에러!!', (error as { message: string }).message);
  }

  return new Response(JSON.stringify(data));
}

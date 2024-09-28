/* eslint-disable no-useless-escape */
// 출처
// http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC0201020502

import type { Company } from '@/app/dashboard/CompaniesTable';
import dayjs from 'dayjs';

import { companySchema } from '@/types/companies';
import { infoRecordSchema } from '@/types/info';
import type { InfoRecord, InfoType } from '@/types/info';
import { krxCrawlingResponseSchema } from '@/types/krx';
import type { KrxItem } from '@/types/krx';

import { getItems, getItemsWithDocId, setItems, setItemsWithDocId } from '../db';

// TODO : companies 정보는 하나의 문서에서 가져오도록 수정

const getDataFromKRX = async (targetDateString: string) => {
  // YYYY-MM-DD 의 형식으로 요청이 들어옴
  const parsedTargetDateString = targetDateString.split('-').join('');

  const today = dayjs().subtract(1, 'days');
  const oneWeekAgo = dayjs().subtract(1, 'week');
  const todayString = today.format('YYYYMMDD');
  const oneWeekAgoString = oneWeekAgo.format('YYYYMMDD');

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
    body: `bld=dbms/MDC/STAT/standard/MDCSTAT03501&locale=ko_KR&searchType=1&mktId=STK&trdDd=${parsedTargetDateString}&tboxisuCd_finder_stkisu0_0=024110%2F%EA%B8%B0%EC%97%85%EC%9D%80%ED%96%89&isuCd=KR7024110009&isuCd2=KR7024110009&codeNmisuCd_finder_stkisu0_0=%EA%B8%B0%EC%97%85%EC%9D%80%ED%96%89&param1isuCd_finder_stkisu0_0=ALL&strtDd=${todayString}&endDd=${oneWeekAgoString}&csvxls_isNo=false`,
    method: 'POST',
  });

  const parsedData = krxCrawlingResponseSchema.parse(await response.json());

  return parsedData;
};

// krx 에서 크롤링한 결과를 기반으로 각 회사의 기간별 info 수치를 기록
const setCompanyInfo = async ({
  infoType,
  krxItems,
  companies,
  targetDateString,
}: {
  infoType: InfoType;
  krxItems: KrxItem[];
  companies: Company[];
  targetDateString: string;
}) => {
  const promises = companies.map(async ({ name }) => {
    const records: InfoRecord[] = (await getItemsWithDocId(infoType, name, 'records')).map((record) =>
      infoRecordSchema.parse(record)
    );

    const prevRecordIndex = records.findIndex((record) => record.id === targetDateString);
    const targetKrxItem = krxItems.find((krxItem) => krxItem.ISU_ABBRV === name);

    if (!targetKrxItem) {
      return;
    }

    if (prevRecordIndex !== -1) {
      records.splice(prevRecordIndex, 1, {
        id: targetDateString,
        dateTimestamp: dayjs(targetDateString).unix(),
        value: targetKrxItem[infoType],
      });
    } else {
      records.push({
        id: targetDateString,
        dateTimestamp: dayjs(targetDateString).unix(),
        value: targetKrxItem[infoType],
      });
    }

    await setItemsWithDocId(infoType, name, 'records', records);

    return records;
  });

  return await Promise.all(promises);
};

// const specialCharactersRegex = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;

export async function GET(request: Request) {
  const targetDateString = new URL(request.url).searchParams.get('date')?.split('-').join('-') ?? '';

  const { output: krxItems } = await getDataFromKRX(targetDateString);

  const companiesFromKRX = krxItems
    .filter((item) => Number(item.PBR) >= 2)
    .map((krxItem) => ({
      id: krxItem.ISU_ABBRV,
      name: krxItem.ISU_ABBRV,
    }));

  const companiesFromDB = (await getItems<Company>('companies')).map((company) => companySchema.parse(company));

  if (companiesFromKRX.some((company) => !companiesFromDB.some((dbCompany) => dbCompany.name === company.name))) {
    await setItems('companies', companiesFromKRX);
  }

  const companies = companiesFromKRX;

  // const [pbrItemsPromiseResult, epsItemsPromiseResult, perItemsPromiseResult] = await Promise.all([
  //   getItems(COLLECTION.PBR),
  //   getItems(COLLECTION.EPS),
  //   getItems(COLLECTION.PER),
  // ]);

  // const pbrItems = pbrItemsPromiseResult.map((item) => infoSchema.parse(item));
  // const epsItems = epsItemsPromiseResult.map((item) => infoSchema.parse(item));
  // const perItems = perItemsPromiseResult.map((item) => infoSchema.parse(item));

  // const promises: Promise<void>[] = [];

  // const pushPromise = (infoType: InfoType, items: z.infer<typeof krxCrawlingResponseSchema>['output']) => {
  //   promises.push(setItems(`${infoType}/${company.name}`, [{ id: targetDateString, date: targetDateString, value: item[infoType] }]));
  // }

  // const companyInfoMap: Record<string, Array<{ date: string, value: string }>> = {}

  // krxItems.forEach((krxItem) => {
  //   const company = companies.find((company) => company.name === krxItem.ISU_ABBRV);

  //   // TODO : company가 없는 경우 새로운 company 정보를 추가하는 함수를 구현
  //   if (!company) {
  //     return;
  //   }

  //   companyInfoMap[company.name] = companyInfoMap[company.name] ? [...companyInfoMap[company.name], {date: targetDateString, value: krxItem[]}] : [];

  //   set

  //   Object.keys(krxItem).forEach((key) => {
  //     const company = companies.find((company) => company.name === krxItem.ISU_ABBRV);
  //     if (!company) {
  //       return;
  //     }

  //     if (key === COLLECTION.PBR) {
  //       promises.push(setItems(`${COLLECTION.PBR}/${company.name}`, [{ id: targetDateString, date: targetDateString, value: krxItem.PBR }]));
  //     }

  //     if (key === COLLECTION.PER) {
  //       const perItem = perItems.find((pbr) => pbr.id === company.id);

  //       if (perItem) {
  //         perItem.record[targetDateString] = krxItem.PER;
  //       } else {
  //         perItems.push({
  //           id: company.id,
  //           record: {
  //             [targetDateString]: krxItem.PER,
  //           },
  //         });
  //       }
  //     }

  //     if (key === COLLECTION.EPS) {
  //       const epsItem = epsItems.find((pbr) => pbr.id === company.id);

  //       if (epsItem) {
  //         epsItem.record[targetDateString] = krxItem.EPS;
  //       } else {
  //         epsItems.push({
  //           id: company.id,
  //           record: {
  //             [targetDateString]: krxItem.EPS,
  //           },
  //         });
  //       }
  //     }
  //   });
  // });

  // await Promise.all([
  //   setItems(COLLECTION.PBR, pbrItems),
  //   setItems(COLLECTION.PER, perItems),
  //   setItems(COLLECTION.EPS, epsItems),
  // ]);

  const result = await Promise.all([
    setCompanyInfo({ infoType: 'PBR', krxItems, companies, targetDateString }),
    setCompanyInfo({ infoType: 'EPS', krxItems, companies, targetDateString }),
    setCompanyInfo({ infoType: 'PER', krxItems, companies, targetDateString }),
  ]);

  // const data = {
  //   pbr: `${pbrItems.length.toLocaleString()}건 수집됨`,
  //   per: `${perItems.length.toLocaleString()}건 수집됨`,
  //   eps: `${epsItems.length.toLocaleString()}건 수집됨`,
  // };

  return new Response(JSON.stringify(result), { status: 200 });
}

// TODO : 회사 데이터가 없는 경우에만 이를 새로 크롤링하는 함수를 구현

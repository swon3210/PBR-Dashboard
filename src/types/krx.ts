import zod from 'zod';

export type KrxItem = zod.infer<typeof krxCrawlingResponseSchema>['output'][number];

export const krxCrawlingResponseSchema = zod.object({
  output: zod.array(
    zod.object({
      ISU_SRT_CD: zod.string(),
      ISU_CD: zod.string(),
      MKT_ID: zod.string(),
      ISU_ABBRV: zod.string(),
      ISU_ABBRV_STR: zod.string(),
      TDD_CLSPRC: zod.string(),
      FLUC_TP_CD: zod.string(),
      CMPPREVDD_PRC: zod.string(),
      FLUC_RT: zod.string(),
      EPS: zod.string(),
      PER: zod.string(),
      FWD_EPS: zod.string(),
      FWD_PER: zod.string(),
      BPS: zod.string(),
      PBR: zod.string(),
      DPS: zod.string(),
      DVD_YLD: zod.string(),
    })
  ),
});

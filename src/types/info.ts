import zod from 'zod';

export type InfoType = 'PBR' | 'EPS' | 'PER';

export type Info = zod.infer<typeof infoSchema>;

export const infoSchema = zod.object({
  id: zod.string(),
  record: zod.record(zod.string()),
});

export type InfoRecord = zod.infer<typeof infoRecordSchema>;

export const infoRecordSchema = zod.object({ id: zod.string(), dateTimestamp: zod.number(), value: zod.string() });

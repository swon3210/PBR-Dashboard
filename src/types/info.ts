import zod from 'zod';

export type InfoType = 'PBR' | 'EPS' | 'PER';

export const infoSchema = zod.object({
  id: zod.string(),
  record: zod.record(zod.string()),
});

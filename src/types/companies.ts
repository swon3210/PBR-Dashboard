import zod from 'zod';

export type Company = zod.infer<typeof companySchema>;

export const companySchema = zod.object({
  id: zod.string(),
  name: zod.string(),
});

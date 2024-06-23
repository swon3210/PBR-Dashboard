import zod from 'zod';

export const companySchema = zod.object({
  id: zod.string(),
  name: zod.string(),
});

import { z } from 'zod';

const ResponseSchema = z.array(
  z.object({
    dayofExamsId: z.number(),
    response: z.string(),
  })
);

export default ResponseSchema;

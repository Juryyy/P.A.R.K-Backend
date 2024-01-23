import { z } from 'zod';

const ResponseSchema = z.array(
  z.object({
    id: z.number(),
    response: z.string(),
  })
);

export default ResponseSchema;

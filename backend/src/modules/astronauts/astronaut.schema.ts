import { z } from "zod";

export const astronautId = z.coerce.number().int().positive();

export const findAstronautsQuery = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional()
});

export const createAstronautBody = z.object({
  name: z.string().trim().min(2),
  role: z.string().trim().min(1),
  nationality: z.string().trim().min(1)
});

export const updateAstronautBody = z
  .object({
    name: z.string().trim().min(2).optional(),
    role: z.string().trim().min(1).optional(),
    nationality: z.string().trim().min(1).optional(),
    status: z.enum(["active", "inactive"]).optional()
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "at least one field is required"
  });

export type FindAstronautsParams = z.infer<typeof findAstronautsQuery>;
export type CreateAstronautData = z.infer<typeof createAstronautBody>;
export type UpdateAstronautData = z.infer<typeof updateAstronautBody>;

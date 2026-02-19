import z from "zod"

export const UserQuerySchema = z.object({
  userId: z.string(),
})

export const UserUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  image: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  jobTitle: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
})

export type UserUpdateInput = z.infer<typeof UserUpdateSchema>

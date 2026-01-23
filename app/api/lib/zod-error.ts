import { ZodError, flattenError } from "zod"
import { fail } from "./response"

export const zodError = (error: ZodError) => {
  const flattened = flattenError(error)

  const errors: Record<string, string[]> = {
    ...flattened.fieldErrors,
  }

  if (flattened.formErrors.length > 0) {
    errors._form = flattened.formErrors
  }

  return fail("Invalid request data", 400, "VALIDATION_ERROR", errors)
}

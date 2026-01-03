import { ZodError } from 'zod';

export function formatZodError(error: ZodError) {
  return error.issues.reduce(
    (acc, issue) => {
      const field = issue.path.join('.');
      acc[field] = issue.message;
      return acc;
    },
    {} as Record<string, string>,
  );
}

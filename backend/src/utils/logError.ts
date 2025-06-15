export function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`${context}:`, error.message);
    console.error(error.stack);
  } else {
    try {
      console.error(`${context}:`, JSON.stringify(error, null, 2));
    } catch {
      console.error(`${context}:`, error);
    }
  }
}

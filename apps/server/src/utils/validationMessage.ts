export function getFirstValidationMessage(error: any): string | null {
  try {
    const parsed = JSON.parse(error.message);
    return Array.isArray(parsed) && parsed[0]?.message
      ? parsed[0].message
      : null;
  } catch (e) {
    return null;
  }
}

export const excerpt = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

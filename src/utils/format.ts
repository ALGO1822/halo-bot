export const escapeMarkdown = (text: string | number): string => {
  const str = typeof text === 'number' ? text.toString() : text;
  return str.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
};

export default escapeMarkdown
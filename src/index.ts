import Parser, { ParserOptions } from "./Parser";

export const parse = (content: string, options: ParserOptions = {}) => {
  const contentParser = new Parser(content, options);

  return contentParser.getParsedContent();
};

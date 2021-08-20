import { ContentNode } from "../node";

type HtmlNodeAttrs = {
  [key: string]: string;
};

export type HtmlNode = {
  type: string;
  tag: string;
  attrs: HtmlNodeAttrs;
  children: ContentNode[];
};

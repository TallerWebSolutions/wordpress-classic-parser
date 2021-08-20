import {
  map,
  cond,
  propEq,
  pipe,
  replace,
  T,
  prop,
  always,
  includes,
} from "ramda";
import { Node } from "node-html-parser";
import { ContentNode } from "../nodes/node";

const replaceBreaklines = replace(/(?:\n|\r\n|<br\s?\/?>)/g, "<br />");
const removeTabs = replace(/[\t]+\s?/g, "");

export const normalizeContent = pipe<string, string, string>(
  replaceBreaklines,
  removeTabs
);

export const normalizeEmbedType = cond([
  [
    propEq("type", "closed"),
    pipe(
      prop("content"),
      cond([
        [includes("twitter.com"), always("embed:twitter")],
        [includes("youtube.com"), always("embed:youtube")],
        [includes("instagram.com"), always("embed:instagram")],
        [includes("facebook.com"), always("embed:facebook")],
        [T, always("embed:unknown")],
      ])
    ),
  ],
  [T, always("embed:unknown")],
]);

type ParserFunction = (node: Node) => ContentNode | ContentNode[];

export const nodesReducer = (parserFn: ParserFunction) => (nodes: Node[]) =>
  nodes.reduce<ContentNode[]>((acc, item) => {
    const parsedItem = parserFn(item);

    if (Array.isArray(parsedItem)) {
      return [...acc, ...parsedItem];
    }

    return [...acc, parsedItem];
  }, []);

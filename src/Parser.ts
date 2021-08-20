import { head } from "ramda";
import { regexp } from "@wordpress/shortcode";
import parse, { HTMLElement, NodeType, Node } from "node-html-parser";
import {
  nodesReducer,
  normalizeContent,
  normalizeEmbedType,
} from "./lib/normalizers";
import Embed, { EmbedTypeProcessor } from "./nodes/embed";
import RawNode, { ContentNode } from "./nodes/node";
import Text from "./nodes/text";
import Paragraph from "./Paragraph";

type ContentPreprocessor = (content: string) => string;

export type ParserOptions = {
  contentPreprocessor?: ContentPreprocessor;
  embedTypeProcessor?: EmbedTypeProcessor;
};

export default class Parser {
  private _content: string;
  private _options: Required<ParserOptions>;

  public constructor(content: string, options: ParserOptions) {
    const contentPreprocessor = options.contentPreprocessor || normalizeContent;
    const embedTypeProcessor = options.embedTypeProcessor || normalizeEmbedType;

    this._content = content;
    this._options = { contentPreprocessor, embedTypeProcessor };
  }

  public getParsedContent() {
    const content = this._content;
    const processedContent = this.preProcessContent(content);

    const { childNodes } = parse(processedContent);
    const nodeParserReducer = nodesReducer(this.nodeParser);
    const items = nodeParserReducer(childNodes);

    const paragraph = new Paragraph(items);
    return [paragraph.getParagraph()];
  }

  private preProcessContent(content: string) {
    const { contentPreprocessor } = this._options;

    return contentPreprocessor(content);
  }

  nodeParser = (node: Node): ContentNode | ContentNode[] => {
    if (node.nodeType === NodeType.TEXT_NODE) {
      const { rawText } = node;

      return this.getNodesFromContent(rawText);
    }

    const { rawTagName, attributes, childNodes } = node as HTMLElement;
    const nodeParserReducer = nodesReducer(this.nodeParser);

    return {
      type: "tag",
      tag: rawTagName,
      attrs: attributes,
      children: nodeParserReducer(childNodes),
    };
  };

  private getNodesFromContent(content: string): ContentNode[] {
    const embeds = this.getEmbedsFromContent(content);

    let currentIndex = 0;
    const reducedItems = embeds.reduce<RawNode[]>((acc, node) => {
      const { startIndex, value } = node;
      const nodes: RawNode[] = [];

      if (currentIndex < startIndex) {
        const value = content.substring(currentIndex, startIndex);
        const textNode = new Text(value, currentIndex);
        nodes.push(textNode);
      }

      currentIndex = startIndex + value.length;
      nodes.push(node);

      return [...acc, ...nodes];
    }, []);

    if (currentIndex < content.length) {
      const value = content.substring(currentIndex);
      const textNode = new Text(value, currentIndex);
      reducedItems.push(textNode);
    }

    return reducedItems.map((item) => item.transform());
  }

  private getEmbedsFromContent(content: string): RawNode[] {
    const regexEmbed = regexp("embed");
    const embeds: RawNode[] = [];

    let match;

    while ((match = regexEmbed.exec(content)) !== null) {
      const { embedTypeProcessor } = this._options;
      const embedValue = head(match);
      const value = embedValue || "";
      const embed = new Embed(value, match.index, { embedTypeProcessor });
      embeds.push(embed);
    }

    return embeds;
  }
}

import { ContentNode } from "./nodes/node";

export type ParagraphType = {
  type: "paragraph";
  children: ContentNode[];
};

export default class Paragraph {
  private _itens: ContentNode[];

  public constructor(itens: ContentNode[]) {
    this._itens = itens;
  }

  public getParagraph(): ParagraphType {
    return {
      type: "paragraph",
      children: this._itens,
    };
  }
}

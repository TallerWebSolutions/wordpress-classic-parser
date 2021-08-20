import { EmbedNode } from "./embed";
import { HtmlNode } from "./html";
import { TextNode } from "./text";

type ErrrorNode = {
  type: string;
  content: string;
};

export type ContentNode<T = {}> = T | ErrrorNode;

export default abstract class RawNode {
  protected _value: string;
  protected _startIndex: number;
  abstract getType(): string;
  abstract transform(): ContentNode;

  public constructor(value: string, startIndex: number) {
    this._value = value;
    this._startIndex = startIndex;
  }

  public get value() {
    return this._value;
  }

  public get startIndex() {
    return this._startIndex;
  }
}

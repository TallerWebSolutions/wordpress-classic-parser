import RawNode from "../node";
import { ContentNode } from "../node";

export type TextNode = {
  type: string;
  value: string;
};

export default class Text extends RawNode {
  public constructor(value: string, startIndex: number) {
    super(value, startIndex);
  }

  public getType() {
    return "text";
  }

  public transform(): ContentNode<TextNode> {
    const value = this._value;

    return {
      value,
      type: this.getType(),
    };
  }
}

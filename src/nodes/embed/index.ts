import { next, Shortcode } from "@wordpress/shortcode";
import RawNode from "../node";
import { ContentNode } from "../node";

type WPShortcodeNamedAttrs = {
  [index: string]: string | undefined;
};

type WPShortcodeAttrs = {
  named: WPShortcodeNamedAttrs;
  numeric: string[];
};

export type EmbedNode = {
  type: string;
  value: string;
  attrs: WPShortcodeAttrs;
};

export type EmbedTypeProcessor = (shortcode: Shortcode) => string;

type EmbedOptions = {
  embedTypeProcessor: EmbedTypeProcessor;
};

export default class Embed extends RawNode {
  private _options: EmbedOptions;

  public constructor(value: string, startIndex: number, options: EmbedOptions) {
    super(value, startIndex);
    this._options = options;
  }

  public getType() {
    return "embed";
  }

  public transform(): ContentNode<EmbedNode> {
    const { embedTypeProcessor } = this._options;
    const value = this._value;
    const match = next("embed", value);

    if (!match) {
      return {
        type: "error",
        content: value,
      };
    }

    const { shortcode } = match;
    const shortcodeValue = shortcode.type === "closed" ? shortcode.content : "";

    return {
      type: embedTypeProcessor(shortcode),
      value: shortcodeValue,
      attrs: shortcode.attrs,
    };
  }
}

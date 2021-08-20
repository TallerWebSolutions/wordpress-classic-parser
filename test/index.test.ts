import { parse } from "../src/index";
import { ParserOptions } from "../src/Parser";

describe("parser", () => {
  it("should return parsed content", () => {
    const content = "Text";

    const expected = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "Text",
          },
        ],
      },
    ];

    expect(parse(content)).toStrictEqual(expected);
  });

  it("should parse tags when they are present in content", () => {
    const content =
      'Text<a href="https://www.abc.com">ABC</a><a href="https://www.xyz.com">XYZ</a>Another Text';

    const expected = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "Text",
          },
          {
            type: "tag",
            tag: "a",
            children: [
              {
                type: "text",
                value: "ABC",
              },
            ],
            attrs: {
              href: "https://www.abc.com",
            },
          },
          {
            type: "tag",
            tag: "a",
            children: [
              {
                type: "text",
                value: "XYZ",
              },
            ],
            attrs: {
              href: "https://www.xyz.com",
            },
          },
          {
            type: "text",
            value: "Another Text",
          },
        ],
      },
    ];

    expect(parse(content)).toStrictEqual(expected);
  });

  it("should parse embeds when they are present in content", () => {
    const content =
      "Text\r\n[embed]https://www.twitter.com.br/some-url[/embed]";

    const expected = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "Text",
          },
          {
            type: "tag",
            tag: "br",
            attrs: {},
            children: [],
          },
          {
            type: "embed:twitter",
            value: "https://www.twitter.com.br/some-url",
            attrs: {
              named: {},
              numeric: [],
            },
          },
        ],
      },
    ];

    expect(parse(content)).toStrictEqual(expected);
  });

  it("should replace breaklines for br tag in parsed content", () => {
    const content = "Text\r\nAnother Text";

    const expected = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "Text",
          },
          {
            type: "tag",
            tag: "br",
            attrs: {},
            children: [],
          },
          {
            type: "text",
            value: "Another Text",
          },
        ],
      },
    ];

    expect(parse(content)).toStrictEqual(expected);
  });

  it("should parse complex content with nested elements", () => {
    const content =
      '<br><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><div id="pnull-m283-1-284" class=""><div style="margin:0 auto; min-width:300px; "><div style="position: relative; padding-bottom:56.25%; height: 0; overflow: hidden; "><iframe src="https://embed.site.com/v2/?p=eyJrZXkiOiJnTDVOdmFjRyIsInAiOiJsYW5jZSIsInBsIjoiIn0=" style="width: 300px; min-width: 100%; position: absolute; top:0; left: 0; height: 100%; overflow: hidden; " width="100%" frameborder="0" allowfullscreen scrolling="no"></iframe></div></div></div><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?<br><br><a href="https://www.news.com/sports/" target="_blank" rel="noopener noreferrer">Sport News</a><br><br>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.<br></p><div class="related-articles-lance">AND MORE:<ul class="related-links bullet"><li class="bullet" id="m227-226-228" data-collection="pnull-m145-2-146"><a class="page-item-link" id="m231-230-232" href="https://www.news.com/sports/news-1?linkback">Sport News 1</a></li><li class="bullet" id="m238-237-239" data-collection="pnull-m145-2-146"><a class="page-item-link" id="m242-241-243" href="https://www.news.com/sports/news-2?linkback">Sport News 2</a></li><li class="bullet" id="m249-248-250" data-collection="pnull-m145-2-146"><a class="page-item-link" id="m253-252-254" href="https://www.news.com/sports/news-3?linkback">Sport News 3</a></li><li class="bullet" id="m260-259-261" data-collection="pnull-m145-2-146"><a class="page-item-link" id="m264-263-265" href="https://www.news.com/sports/news-4?linkback">Sport News 4</a></li></ul></div><div class="related-articles-lance">\tAND MORE:\t<ul class="related-links bullet"><li class="bullet"><a class="page-item-link" href="https://www.news.com?linkback" target="_blank" rel="noopener noreferrer"></a>\t</li><li class="bullet"><a class="page-item-link" href="https://www.news.com?linkback" target="_blank" rel="noopener noreferrer"></a>\t</li><li class="bullet"><a class="page-item-link" href="https://www.news.com?linkback" target="_blank" rel="noopener noreferrer"></a>\t</li><li class="bullet"><a class="page-item-link" href="https://www.news.com?linkback" target="_blank" rel="noopener noreferrer"></a>\t</li></ul> </div>';

    const expected = [
      {
        type: "paragraph",
        children: [
          {
            type: "tag",
            tag: "br",
            children: [],
            attrs: {},
          },
          {
            type: "tag",
            tag: "p",
            children: [
              {
                type: "text",
                value:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              },
            ],
            attrs: {},
          },
          {
            type: "tag",
            tag: "div",
            attrs: {
              id: "pnull-m283-1-284",
              class: "",
            },
            children: [
              {
                type: "tag",
                tag: "div",
                attrs: {
                  style: "margin:0 auto; min-width:300px; ",
                },
                children: [
                  {
                    type: "tag",
                    tag: "div",
                    attrs: {
                      style:
                        "position: relative; padding-bottom:56.25%; height: 0; overflow: hidden; ",
                    },
                    children: [
                      {
                        type: "tag",
                        tag: "iframe",
                        attrs: {
                          src: "https://embed.site.com/v2/?p=eyJrZXkiOiJnTDVOdmFjRyIsInAiOiJsYW5jZSIsInBsIjoiIn0=",
                          style:
                            "width: 300px; min-width: 100%; position: absolute; top:0; left: 0; height: 100%; overflow: hidden; ",
                          width: "100%",
                          frameborder: "0",
                          allowfullscreen: "",
                          scrolling: "no",
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "tag",
            tag: "p",
            attrs: {},
            children: [
              {
                type: "text",
                value:
                  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
              },
              {
                type: "tag",
                tag: "br",
                attrs: {},
                children: [],
              },
              {
                type: "tag",
                tag: "br",
                attrs: {},
                children: [],
              },
              {
                type: "tag",
                tag: "a",
                attrs: {
                  href: "https://www.news.com/sports/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                children: [
                  {
                    type: "text",
                    value: "Sport News",
                  },
                ],
              },
              {
                type: "tag",
                tag: "br",
                attrs: {},
                children: [],
              },
              {
                type: "tag",
                tag: "br",
                attrs: {},
                children: [],
              },
              {
                type: "text",
                value:
                  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
              },
              {
                type: "tag",
                tag: "br",
                attrs: {},
                children: [],
              },
            ],
          },
          {
            tag: "div",
            type: "tag",
            attrs: {
              class: "related-articles-lance",
            },
            children: [
              {
                type: "text",
                value: "AND MORE:",
              },
              {
                tag: "ul",
                type: "tag",
                attrs: {
                  class: "related-links bullet",
                },
                children: [
                  {
                    tag: "li",
                    type: "tag",
                    attrs: {
                      class: "bullet",
                      "data-collection": "pnull-m145-2-146",
                      id: "m227-226-228",
                    },
                    children: [
                      {
                        attrs: {
                          class: "page-item-link",
                          href: "https://www.news.com/sports/news-1?linkback",
                          id: "m231-230-232",
                        },
                        children: [
                          {
                            type: "text",
                            value: "Sport News 1",
                          },
                        ],
                        tag: "a",
                        type: "tag",
                      },
                    ],
                  },
                  {
                    tag: "li",
                    type: "tag",
                    attrs: {
                      class: "bullet",
                      "data-collection": "pnull-m145-2-146",
                      id: "m238-237-239",
                    },
                    children: [
                      {
                        tag: "a",
                        type: "tag",
                        attrs: {
                          class: "page-item-link",
                          href: "https://www.news.com/sports/news-2?linkback",
                          id: "m242-241-243",
                        },
                        children: [
                          {
                            type: "text",
                            value: "Sport News 2",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    attrs: {
                      class: "bullet",
                      "data-collection": "pnull-m145-2-146",
                      id: "m249-248-250",
                    },
                    children: [
                      {
                        tag: "a",
                        type: "tag",
                        attrs: {
                          class: "page-item-link",
                          href: "https://www.news.com/sports/news-3?linkback",
                          id: "m253-252-254",
                        },
                        children: [
                          {
                            type: "text",
                            value: "Sport News 3",
                          },
                        ],
                      },
                    ],
                    tag: "li",
                    type: "tag",
                  },
                  {
                    tag: "li",
                    type: "tag",
                    attrs: {
                      class: "bullet",
                      "data-collection": "pnull-m145-2-146",
                      id: "m260-259-261",
                    },
                    children: [
                      {
                        tag: "a",
                        type: "tag",
                        attrs: {
                          class: "page-item-link",
                          href: "https://www.news.com/sports/news-4?linkback",
                          id: "m264-263-265",
                        },
                        children: [
                          {
                            type: "text",
                            value: "Sport News 4",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            type: "tag",
            attrs: {
              class: "related-articles-lance",
            },
            children: [
              {
                type: "text",
                value: "AND MORE:",
              },
              {
                tag: "ul",
                type: "tag",
                attrs: {
                  class: "related-links bullet",
                },
                children: [
                  {
                    tag: "li",
                    type: "tag",
                    attrs: {
                      class: "bullet",
                    },
                    children: [
                      {
                        tag: "a",
                        type: "tag",
                        attrs: {
                          class: "page-item-link",
                          href: "https://www.news.com?linkback",
                          rel: "noopener noreferrer",
                          target: "_blank",
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    tag: "li",
                    type: "tag",
                    attrs: {
                      class: "bullet",
                    },
                    children: [
                      {
                        tag: "a",
                        type: "tag",
                        attrs: {
                          class: "page-item-link",
                          href: "https://www.news.com?linkback",
                          rel: "noopener noreferrer",
                          target: "_blank",
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    tag: "li",
                    type: "tag",
                    attrs: {
                      class: "bullet",
                    },
                    children: [
                      {
                        attrs: {
                          class: "page-item-link",
                          href: "https://www.news.com?linkback",
                          rel: "noopener noreferrer",
                          target: "_blank",
                        },
                        children: [],
                        tag: "a",
                        type: "tag",
                      },
                    ],
                  },
                  {
                    tag: "li",
                    type: "tag",
                    attrs: {
                      class: "bullet",
                    },
                    children: [
                      {
                        tag: "a",
                        type: "tag",
                        attrs: {
                          class: "page-item-link",
                          href: "https://www.news.com?linkback",
                          rel: "noopener noreferrer",
                          target: "_blank",
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: "text",
                value: " ",
              },
            ],
          },
        ],
      },
    ];

    expect(parse(content)).toStrictEqual(expected);
  });

  it("should use embedTypeProcessor passed as options", () => {
    const content = "Text[embed]https://www.twitter.com.br/some-url[/embed]";

    const options: ParserOptions = {
      embedTypeProcessor: (shortcode) => {
        const { type } = shortcode;

        return type === "closed" ? "embed:closed" : "embed:other";
      },
    };

    const expected = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "Text",
          },
          {
            type: "embed:closed",
            value: "https://www.twitter.com.br/some-url",
            attrs: {
              named: {},
              numeric: [],
            },
          },
        ],
      },
    ];

    expect(parse(content, options)).toStrictEqual(expected);
  });

  it("should use contentPreprocessor passed as options", () => {
    const content = "Text\r\nAnother Text";

    const options: ParserOptions = {
      contentPreprocessor: (content) => content.replace(/\r\n/, "<hr />"),
    };

    const expected = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "Text",
          },
          {
            type: "tag",
            tag: "hr",
            attrs: {},
            children: [],
          },
          {
            type: "text",
            value: "Another Text",
          },
        ],
      },
    ];

    expect(parse(content, options)).toStrictEqual(expected);
  });
});

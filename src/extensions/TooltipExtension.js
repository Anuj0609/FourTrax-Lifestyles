import { mergeAttributes } from "@tiptap/core";
import { Mark } from "@tiptap/core";

const Tooltip = Mark.create({
  name: "tooltip",

  addAttributes() {
    return {
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-tooltip]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { title, ...rest } = HTMLAttributes; // Exclude 'title' from inner content
    return ["span", mergeAttributes(rest, { "data-tooltip": title }), 0];
  },

  addCommands() {
    return {
      toggleTooltip:
        (attrs) =>
        ({ commands }) => {
          return commands.setMark("tooltip", attrs);
        },
    };
  },
});

export default Tooltip;

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Tooltip from "./extensions/TooltipExtension";
import "./App.css";

const App = () => {
  const [tooltipText, setTooltipText] = useState("");
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const [isTooltipDeactivated, setIsTooltipDeactivated] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit, Tooltip],
    content: '<p>Hello <span data-tooltip="This is a tooltip">world</span></p>',
  });

  // Function to check if the selected text has a tooltip
  const getTooltipFromSelection = () => {
    const { state } = editor;
    const { selection } = state;
    const { from, to } = selection;

    if (from !== to) {
      const selectedText = editor.state.doc.slice(from, to); // Get selected text range
      let tooltip = null;

      selectedText.forEach((node) => {
        if (node.marks) {
          node.marks.forEach((mark) => {
            if (mark.type.name === "tooltip") {
              tooltip = mark.attrs.title; // Extract tooltip text
            }
          });
        }
      });

      return tooltip;
    }
    return null;
  };

  // Update the input field whenever the selection changes
  const handleSelectionChange = () => {
    const existingTooltip = getTooltipFromSelection();
    if (existingTooltip) {
      setTooltipText(existingTooltip); // Set tooltip text to input if selected text has a tooltip
    } else {
      setTooltipText(""); // Clear input if no tooltip is found
    }
  };

  // Monitor editor selection changes
  useEffect(() => {
    if (editor) {
      editor.on("selectionUpdate", handleSelectionChange); // Listen for selection updates
    }
  }, [editor]);

  const handleAddTooltip = () => {
    if (tooltipText) {
      const { state } = editor;
      const { selection } = state;
      const { from, to } = selection;

      if (from !== to) {
        editor
          .chain()
          .focus()
          .setMark("tooltip", { title: tooltipText })
          .run();

        setTooltipText("");
      }
    }
  };

  const handleDeleteTooltip = () => {
    const { state } = editor;
    const { selection } = state;
    const { from, to } = selection;

    if (from !== to) {
      editor
        .chain()
        .focus()
        .unsetMark("tooltip") 
        .run();
    }
  };

  const handleDeactivateTooltip = () => {
    setIsTooltipDeactivated(true); 
    setIsTooltipActive(false);
  };

  const handleActivateTooltip = () => {
    setIsTooltipDeactivated(false); 
    setIsTooltipActive(true);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen bg-slate-400 ${
        isTooltipDeactivated ? "tooltip-deactivated" : ""
      }`}
    >
      <h1 className="text-4xl font-medium text-blue-950 p-10">
        Tiptap Tooltip Extension
      </h1>
      <div>
        {isTooltipActive && (
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={tooltipText}
              onChange={(e) => setTooltipText(e.target.value)}
              placeholder="Enter tooltip text"
              className="border border-gray-300 p-1 rounded"
            />
            <button
              onClick={handleAddTooltip}
              className="bg-blue-500 text-white p-1 rounded"
            >
              Add/Update Tooltip
            </button>
            <button
              onClick={handleDeleteTooltip}
              className="bg-red-500 text-white p-1 rounded"
            >
              Delete Tooltip
            </button>
          </div>
        )}

        <div className="mt-2">
          {!isTooltipDeactivated ? (
            <button
              onClick={handleDeactivateTooltip}
              className="bg-red-500 text-white p-1 rounded"
            >
              Deactivate Tooltip
            </button>
          ) : (
            <button
              onClick={handleActivateTooltip}
              className="bg-gray-500 text-white p-1 rounded"
            >
              Activate Tooltip
            </button>
          )}
        </div>
      </div>
      <div className="border border-gray-700 rounded-lg p-2 mt-2 w-1/2 min-h-80 text-gray-300">
        {editor && <EditorContent editor={editor} />}
      </div>
    </div>
  );
};

export default App;

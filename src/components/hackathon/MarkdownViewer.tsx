"use client"

import MDEditor from "@uiw/react-md-editor";

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div data-color-mode="light">
      <MDEditor.Markdown source={content} style={{ background: "transparent" }} />
    </div>
  );
}

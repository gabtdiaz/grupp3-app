import React, { useState, useRef, useEffect } from "react";

interface ActivityDetailCommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showCancel?: boolean;
  onCancel?: () => void;
}

export const ActivityDetailCommentInput: React.FC<
  ActivityDetailCommentInputProps
> = ({
  onSubmit,
  placeholder = "Skriv en kommentar...",
  autoFocus = false,
  showCancel = false,
  onCancel,
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) textareaRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 128);
    el.style.height = `${next}px`;
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    onSubmit(trimmed);
    setText("");

    const el = textareaRef.current;
    if (el) el.style.height = "0px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1 bg-gray-50 rounded-lg border border-gray-300 focus-within:border-gray-400 transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="
            w-full bg-transparent text-sm text-gray-900 placeholder-gray-500
            resize-none outline-none overflow-y-auto
            px-3 py-2
            min-h-9 max-h-32
          "
        />
      </div>

      {showCancel && onCancel && (
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors"
        >
          Avbryt
        </button>
      )}

      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          text.trim() ? "bg-[#FF6B6B] text-white" : "bg-gray-200 text-gray-400"
        }`}
      >
        Skicka
      </button>
    </div>
  );
};

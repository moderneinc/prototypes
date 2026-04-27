/**
 * TextField — text-input primitive on the web canvas. The CLI does not
 * have text inputs in its visual layer; on the canvas this is the
 * analogue of the prompt glyph (?) row. Monospace, 1px panel border, no
 * raised styling.
 *
 * Tokens used:
 *   - color.bg.terminal     (input surface)
 *   - color.bg.panel        (border)
 *   - color.text.body       (typed text)
 *   - color.text.supporting (placeholder)
 */
import * as React from "react";

export type TextFieldProps = {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: "text" | "email" | "password" | "url";
  className?: string;
};

export function TextField({
  id,
  name,
  label,
  value,
  defaultValue,
  placeholder,
  onChange,
  type = "text",
  className = "",
}: TextFieldProps) {
  return (
    <label className={`flex flex-col gap-1 ${className}`} htmlFor={id}>
      {label && (
        <span style={{ color: "var(--color-text-supporting)", fontSize: "0.875rem" }}>{label}</span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        className="rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-1"
        style={{
          background: "var(--color-bg-terminal)",
          borderColor: "var(--color-bg-panel)",
          color: "var(--color-text-body)",
          fontFamily: "var(--font-mono)",
        }}
      />
    </label>
  );
}

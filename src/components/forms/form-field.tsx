import { useId } from "react";

import { cn } from "@/lib/utils/cn";

type BaseProps = {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  className?: string;
};

type InputFieldProps = BaseProps & {
  multiline?: false;
} & Omit<React.ComponentPropsWithoutRef<"input">, "id" | "name">;

type TextareaFieldProps = BaseProps & {
  multiline: true;
} & Omit<React.ComponentPropsWithoutRef<"textarea">, "id" | "name">;

type FormFieldProps = InputFieldProps | TextareaFieldProps;

const FIELD_CLASSES =
  "w-full rounded-lg border border-brand-brown/30 bg-white px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:border-primary";

/**
 * Label + input/textarea + error message, wired together for accessibility
 * (contract §17/§19/§22): explicit label association, aria-invalid and
 * aria-describedby on error, required marked both visually and via the
 * native `required` attribute. Built for the Phase 5 ContactForm - not
 * consumed yet, so it's covered by a unit test instead of a live page.
 */
export function FormField({
  label,
  name,
  error,
  required,
  multiline,
  className,
  ...props
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-foreground text-sm font-semibold">
        {label}
        {required ? (
          <span aria-hidden className="text-primary">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(FIELD_CLASSES, "min-h-32 resize-y")}
          {...(props as React.ComponentPropsWithoutRef<"textarea">)}
        />
      ) : (
        <input
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={FIELD_CLASSES}
          {...(props as React.ComponentPropsWithoutRef<"input">)}
        />
      )}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-foreground text-sm font-semibold"
        >
          <span aria-hidden>⚠ </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

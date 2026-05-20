import { cloneElement, useId } from "react";
import type { ReactElement } from "react";
import { Label } from "./Label";
import { cn } from "@/lib/cn";

type FieldChildProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactElement<FieldChildProps>;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  className,
  children,
}: FieldProps) {
  const generatedId = useId();
  const id = htmlFor ?? children.props.id ?? generatedId;
  const messageId = error || hint ? `${id}-message` : undefined;

  const child = cloneElement(children, {
    id,
    "aria-describedby": messageId,
    "aria-invalid": error ? true : children.props["aria-invalid"],
  });

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </Label>
      {child}
      {(error || hint) && (
        <p
          id={messageId}
          className={cn(
            "text-xs",
            error ? "text-danger" : "text-muted-foreground",
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

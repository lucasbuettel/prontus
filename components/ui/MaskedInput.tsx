"use client";

import { forwardRef } from "react";
import { Input, type InputProps } from "./Input";
import { formatCpf } from "@/lib/format/cpf";
import { formatPhoneBr } from "@/lib/format/phone";

type MaskKey = "cpf" | "phoneBr";

const FORMATTERS: Record<MaskKey, (raw: string) => string> = {
  cpf: formatCpf,
  phoneBr: formatPhoneBr,
};

export interface MaskedInputProps extends Omit<InputProps, "value" | "onChange"> {
  mask: MaskKey;
  value: string;
  onChange: (formatted: string) => void;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput({ mask, value, onChange, ...rest }, ref) {
    const fmt = FORMATTERS[mask];
    return (
      <Input
        ref={ref}
        value={value}
        onChange={(e) => onChange(fmt(e.target.value))}
        {...rest}
      />
    );
  },
);

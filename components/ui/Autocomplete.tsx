"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Input, type InputProps } from "./Input";
import { cn } from "@/lib/cn";

export interface AutocompleteOption {
  /** Valor escrito no input quando o usuário seleciona a opção. */
  value: string;
  /** Conteúdo visível no dropdown. */
  label: ReactNode;
  /** Texto secundário (segunda linha menor). */
  secondary?: ReactNode;
}

interface AutocompleteProps extends Omit<InputProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  /** Recebe a query atual e devolve opções. Chamado a cada digitação. */
  fetchOptions: (query: string) => AutocompleteOption[];
  /** Quantos caracteres antes de mostrar o dropdown. Default 1. */
  minChars?: number;
  emptyLabel?: string;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(
    {
      value,
      onChange,
      fetchOptions,
      minChars = 1,
      emptyLabel = "Nenhum resultado.",
      ...inputProps
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<AutocompleteOption[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (value.length < minChars) {
        setOptions([]);
        return;
      }
      setOptions(fetchOptions(value));
      setActiveIndex(0);
    }, [value, minChars, fetchOptions]);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      onChange(e.target.value);
      setOpen(true);
    }

    function handleSelect(opt: AutocompleteOption) {
      onChange(opt.value);
      setOpen(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (!open || options.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(options[activeIndex]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }

    const showDropdown = open && value.length >= minChars;

    return (
      <div ref={containerRef} className="relative">
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          {...inputProps}
        />

        {showDropdown && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-md border border-border-strong bg-surface shadow-lg"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-xs text-muted-foreground">
                {emptyLabel}
              </li>
            ) : (
              options.map((opt, index) => (
                <li
                  key={`${opt.value}-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-sm",
                    index === activeIndex
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-surface-muted",
                  )}
                >
                  <div className="font-medium">{opt.label}</div>
                  {opt.secondary && (
                    <div className="text-xs text-muted-foreground">
                      {opt.secondary}
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  },
);

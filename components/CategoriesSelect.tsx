import React, { useState, useRef, useEffect } from "react";
import { FieldErrors } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  categories: { name: string }[];
  setValues: (values: string[]) => void;
  errors: FieldErrors<{
    categories: string[];
  }>;
  value?: string[];
}

function CategoriesSelect({ categories, setValues, errors, value }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(value || []);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options: Option[] = categories.map(({ name }) => ({
    value: name,
    label: name,
  }));

  useEffect(() => {
    if (value) {
      setSelectedValues(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectOption = (option: Option) => {
    let newValues: string[];
    if (selectedValues.includes(option.value)) {
      // Remove if already selected
      newValues = selectedValues.filter((value) => value !== option.value);
    } else {
      // Add if not selected
      newValues = [...selectedValues, option.value];
    }
    setSelectedValues(newValues);
    setValues(newValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          handleSelectOption(options[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectedText =
    selectedValues.length > 0 ? selectedValues.join(", ") : "";

  return (
    <div className="w-full relative" ref={dropdownRef} onClick={() => {}}>
      <div
        className={`
          input input-bordered flex items-center gap-2 min-h-[48px] px-3 py-2 cursor-text w-full
          bg-base-100 border-base-content/20 text-base-content
          focus-within:border-primary focus-within:outline-none
          ${errors.categories?.message ? "input-error" : ""}
        `}
        onClick={() => {
          setIsOpen(!isOpen);
          inputRef.current?.focus();
        }}
        onKeyDown={handleKeyDown}
      >
        <span
          className={
            selectedText
              ? "text-base-content max-w-86 truncate"
              : "text-base-content/50"
          }
        >
          {selectedText || "Categories"}
        </span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 outline-none bg-transparent min-w-[20px] opacity-0 absolute"
          placeholder=""
          value=""
          onChange={() => {}}
        />
        <ChevronDown
          className={`w-4 h-4 text-base-content/50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute w-full z-50"
          style={{ bottom: "100%", marginBottom: "0.25rem" }}
        >
          <div className="bg-base-100 border border-base-content/20 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="p-3 text-base-content/50 text-center">
                No categories available
              </div>
            ) : (
              options.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors flex items-center justify-between w-full
                      ${
                        index === highlightedIndex
                          ? "bg-base-200 text-base-content"
                          : "hover:bg-base-200 text-base-content"
                      }
                    `}
                    onClick={() => handleSelectOption(option)}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {errors.categories?.message && (
        <p className="text-error text-sm mt-1">{errors.categories.message}</p>
      )}
    </div>
  );
}

export default CategoriesSelect;

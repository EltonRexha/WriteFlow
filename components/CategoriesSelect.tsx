import React from "react";
import Select from "react-select";
import { FieldErrors } from "react-hook-form";

interface Props {
  categories: { name: string }[];
  setValues: (values: string[]) => void;
  errors: FieldErrors<{
    categories: string[];
  }>;
  modalId: string;
}

function CategoriesSelect({ categories, setValues, errors, modalId }: Props) {
  return (
    <div>
      <Select<{ value: string; label: string }, true>
        placeholder="Categories"
        isMulti
        menuPlacement="top"
        options={categories.map(({ name }) => ({
          value: name,
          label: name,
        }))}
        menuPortalTarget={document.getElementById(modalId)}
        menuPosition={"fixed"}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "var(--fallback-b1,oklch(var(--b1)))",
            borderColor: "var(--fallback-border-color,oklch(var(--bc)/0.2))",
          }),
          menuList: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "var(--color-base-100)",
            padding: 0,
          }),
          menuPortal: (baseStyles) => ({
            ...baseStyles,
          }),
          option: (baseStyles, { isFocused }) => ({
            ...baseStyles,
            backgroundColor: isFocused
              ? "var(--color-base-200)"
              : "var(--color-base-100)",
            cursor: "pointer",
          }),
          multiValue: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "var(--color-base-200)",
          }),
          multiValueLabel: (baseStyles) => ({
            ...baseStyles,
            color: "var(--color-base-foreground)",
          }),
          multiValueRemove: (baseStyles) => ({
            ...baseStyles,
            color: "var(--color-base-foreground)",
            ":hover": {
              backgroundColor: "var(--fallback-error,oklch(var(--er)))",
              color: "white",
            },
          }),
          input: (baseStyles) => ({
            ...baseStyles,
            color: "var(--color-base-foreground)",
          }),
        }}
        className="text-base-content"
        onChange={(values) => {
          setValues(values.map((value) => value.value));
        }}
      />
      <p className="text-error">{errors.categories?.message}</p>
    </div>
  );
}

export default CategoriesSelect;

import { ArrowDownwardOutlined, KeyboardArrowDown } from "@mui/icons-material";
import React, { useContext, useState } from "react";
import { useCombobox, useMultipleSelection } from "downshift";

type SelectOption = {
  label: string;
  id: string;
};

interface SelectI {
  items: SelectOption[];
  label?: string;
  className?: string;
}

interface SelectOptionI {
  children: string;
  onClick: () => void;
}

const SelectContext = React.createContext({});

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Context is not wrapped properly.");
  }
  return context;
}

const Select: React.FC<SelectI> = ({ label, className, children, items }) => {
  const { getSelectedItemProps, getDropdownProps, addSelectedItem, removeSelectedItem, selectedItems } = useMultipleSelection({
    initialSelectedItems: [],
  });

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.label : "";
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            isOpen: !!changes.selectedItem, // keep the menu open after selection.
          };
      }
      return changes;
    },
    onStateChange({ inputValue, type, selectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            const isItemExist = selectedItems.some((item) => item.value === selectedItem.value);
            if (!isItemExist) {
              addSelectedItem(selectedItem);
            } else {
              removeSelectedItem(selectedItem);
            }
          }
          break;
        default:
          break;
      }
    },
  });

  return (
    <SelectContext.Provider value={{ getItemProps, selectedItem, highlightedIndex }}>
      <div className={`w-full mb-3.5 ${className || ""}`}>
        {label && (
          <label className="ff-lato text-xs font-extrabold inline-block mb-1" {...getLabelProps()}>
            {label}
          </label>
        )}
        <div className="relative w-full h-12 rounded-2xl border border-gray flex items-center" {...getComboboxProps()}>
          <input className="w-0 h-0 rounded-2xl" {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))} />
          <button
            aria-label="toggle menu"
            type="button"
            className="w-full border-0 rounded-2xl h-full right-3 w-full border flex items-center px-3 justify-between"
            {...getToggleButtonProps(getDropdownProps({ preventKeyAction: isOpen, tabIndex: 0 }))}
          >
            <div />
            <KeyboardArrowDown />
          </button>
        </div>
      </div>

      <ul className="absolute bg-white shadow-md max-h-80 overflow-scroll w-inherit" {...getMenuProps()}>
        {isOpen && children}
      </ul>
    </SelectContext.Provider>
  );
};

const SelectOption = ({ children, onClick, index, item }: SelectOptionI) => {
  const { getItemProps, selectedItem, highlightedIndex } = useSelectContext();
  const isSelected = selectedItem?.value === item.value;
  const isHighlighted = highlightedIndex === index;
  return (
    <li
      className={`${isSelected ? "font-bold" : "font-light"} ${isHighlighted ? "bg-theme" : "bg-gray"}`}
      {...getItemProps({ item, index })}
    >
      {children}
    </li>
  );
};

export default Select;
export { SelectOption };

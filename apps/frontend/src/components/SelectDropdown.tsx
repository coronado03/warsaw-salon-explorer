'use client';

import * as Select from '@radix-ui/react-select';
import { HiChevronDown, HiCheck } from 'react-icons/hi';

type SelectDropdownProps = {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function SelectDropdown({ value, placeholder, options, onChange }: SelectDropdownProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition min-w-[160px] cursor-pointer data-[placeholder]:text-stone-400">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <HiChevronDown className="w-4 h-4 text-stone-400" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] rounded-xl border border-stone-200 bg-white shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95"
        >
          <Select.Viewport className="p-1">
            <Select.Item
              value="__all__"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-stone-400 cursor-pointer select-none outline-none hover:bg-stone-50 data-[highlighted]:bg-stone-50"
            >
              <Select.ItemText>{placeholder}</Select.ItemText>
            </Select.Item>

            {options.map((opt) => (
              <Select.Item
                key={opt}
                value={opt}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-stone-700 cursor-pointer select-none outline-none hover:bg-fuchsia-50 data-[highlighted]:bg-fuchsia-50 data-[state=checked]:text-fuchsia-700 data-[state=checked]:font-medium"
              >
                <Select.ItemText>{opt}</Select.ItemText>
                <Select.ItemIndicator>
                  <HiCheck className="w-3.5 h-3.5 text-fuchsia-500" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

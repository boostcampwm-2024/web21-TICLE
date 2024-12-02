import { cva } from 'class-variance-authority';
import { useState } from 'react';

import { Dialog } from '@/components/common/Dialog';
import SelectMedia from '@/components/live/SettingDialog/SelectMedia';

const listVariants = cva(
  'flex w-full cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm',
  {
    variants: {
      active: {
        false: 'text-body1 hover:bg-alt',
        true: 'bg-primary text-white',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

const SIDEBAR_ITEMS = [
  {
    title: '오디오 및 비디오',
    Component: SelectMedia,
  },
] as const;

interface SettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function SettingDialog({ isOpen, onClose }: SettingDialogProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const Component = SIDEBAR_ITEMS[activeIndex]?.Component;

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} className="flex h-[500px] w-[600px] flex-col">
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.Close onClose={onClose} />
      <Dialog.Content className="flex h-full flex-1 items-center justify-center gap-x-4">
        <ul className="flex h-full basis-32 flex-col items-start justify-start gap-y-2">
          {SIDEBAR_ITEMS.map((item, index) => (
            <li
              key={index}
              className={listVariants({ active: activeIndex === index })}
              onClick={() => setActiveIndex(index)}
            >
              {item.title}
            </li>
          ))}
        </ul>
        <div className="h-full flex-1">{Component && <Component />}</div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
export default SettingDialog;
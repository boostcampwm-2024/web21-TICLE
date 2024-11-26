import { KeyboardEvent } from 'react';

export interface TabData<T extends string> {
  value: T;
  label: string;
  onClick: () => void;
}

interface TabProps<T extends string> {
  tabItems: TabData<T>[];
  selectedTab: T;
}

function Tab<T extends string>({ tabItems, selectedTab }: TabProps<T>) {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, onClick: () => void) => {
    if (e.key !== 'Enter') return;
    onClick();
  };

  return (
    <div role="tablist" className="flex items-center gap-6">
      {tabItems.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={selectedTab === tab.value}
          onClick={tab.onClick}
          onKeyDown={(e) => handleKeyDown(e, tab.onClick)}
          className="flex cursor-pointer flex-col gap-1.5 bg-transparent"
        >
          <span className="text-head1 text-main">{tab.label}</span>
          <span className={`h-1 w-full ${selectedTab === tab.value ? 'bg-primary' : ''}`} />
        </button>
      ))}
    </div>
  );
}

export default Tab;

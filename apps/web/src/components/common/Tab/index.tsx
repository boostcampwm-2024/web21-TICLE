import { KeyboardEvent } from 'react';

export interface TabData {
  name: string;
  onClick: () => void;
}

interface TabProps {
  tabItems: TabData[];
  selectedTab: string;
}

function Tab({ tabItems, selectedTab }: TabProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, onClick: () => void) => {
    if (e.key !== 'Enter') return;
    onClick();
  };

  return (
    <div role="tablist" className="flex items-center gap-6">
      {tabItems.map((tab) => (
        <button
          key={tab.name}
          role="tab"
          aria-selected={selectedTab === tab.name}
          onClick={tab.onClick}
          onKeyDown={(e) => handleKeyDown(e, tab.onClick)}
          className="flex cursor-pointer flex-col gap-1.5 bg-transparent"
        >
          <span className="text-head1 text-main">{tab.name}</span>
          <span className={`h-1 w-full ${selectedTab === tab.name ? 'bg-primary' : ''}`} />
        </button>
      ))}
    </div>
  );
}

export default Tab;

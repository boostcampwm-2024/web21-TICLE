export interface TabData {
  name: string;
  onClick: () => void;
}

interface TabProps {
  tabItems: TabData[];
  selectedTab: string;
}

function Tab({ tabItems, selectedTab }: TabProps) {
  return (
    <div className="flex items-center gap-6">
      {tabItems.map((tab) => (
        <div key={tab.name} className="flex flex-col gap-1.5">
          <h1 onClick={tab.onClick} className="text-head1 text-main">
            {tab.name}
          </h1>
          {selectedTab === tab.name ? (
            <span className="h-1 w-full bg-primary"></span>
          ) : (
            <span className="h-1"></span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Tab;

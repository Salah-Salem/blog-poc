import TopNav from './TopNav';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

export default function AppShell({ children, hideSidebars = false }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <TopNav />
      <div className="flex w-full gap-4 px-3 py-4 sm:px-4 lg:px-16">
        {!hideSidebars && <LeftSidebar />}
        <main className="min-w-0 flex-1 w-full">
          {children}
        </main>
        {!hideSidebars && <RightSidebar />}
      </div>
    </div>
  );
}

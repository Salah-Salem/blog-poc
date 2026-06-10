import TopNav from './TopNav';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

export default function AppShell({ children, hideSidebars = false }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <TopNav />
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex gap-4">
        {!hideSidebars && <LeftSidebar />}
        <main className="flex-1 min-w-0 max-w-[680px] mx-auto w-full">{children}</main>
        {!hideSidebars && <RightSidebar />}
      </div>
    </div>
  );
}

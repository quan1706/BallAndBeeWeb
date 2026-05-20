import { UserHeader } from '@/components/UserHeader';
import { UserFooter } from '@/components/UserFooter';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E3A5F]">
      <UserHeader />
      <main className="flex-1">{children}</main>
      <UserFooter />
    </div>
  );
}

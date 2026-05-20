import { Outlet } from 'react-router';
import { UserHeader } from '../components/UserHeader';
import { UserFooter } from '../components/UserFooter';

export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
}

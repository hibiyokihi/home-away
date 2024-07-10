'use client';

import { SignOutButton } from '@clerk/nextjs';
import { useToast } from '../ui/use-toast';

function SignOutLink() {
  const { toast } = useToast();
  const handleLogout = () => {
    toast({ description: 'You have been signed out.' });
  };
  return (
    <SignOutButton redirectUrl="/">
      {/* signoutした後のredirect先を指定できる。 */}
      <button className="w-full text-left" onClick={handleLogout}>
        Logout
      </button>
    </SignOutButton>
  );
}
export default SignOutLink;

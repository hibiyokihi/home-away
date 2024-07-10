import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LuAlignLeft } from 'react-icons/lu';
import Link from 'next/link';
import { Button } from '../ui/button';
import UserIcon from './UserIcon';
import { links } from '@/utils/links';
import SignOutLink from './SignOutLink';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
// ログイン状態をclerkが把握し、ログイン時にはSignedInコンポが表示され、ログアウト時にはSignedOutコンポが表示される

function LinksDropdown() {
  return (
    <DropdownMenu>
      {/* MenuTriggerは、Dropdownを表示させるためのボタンの表示 */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4 max-w-[100px]">
          <LuAlignLeft className="w-6 h-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52" align="start" sideOffset={10}>
        {/* ログアウト時には、Dropdownの中にSignInボタンとSignUpボタンが表示される。 */}
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode="modal">
              <button className="w-full text-left">Login</button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignUpButton mode="modal">
              <button className="w-full text-left">Register</button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>
        {/* ログイン時には、Dropdownの中にlinksリストのアイテムとSignOutボタンが表示される */}
        <SignedIn>
          {links.map((link) => {
            return (
              <DropdownMenuItem key={link.href}>
                <Link href={link.href} className="capitalize w-full">
                  {link.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutLink />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;

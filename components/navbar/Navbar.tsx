import { ModeToggle } from './DarkMode';
import LinksDropdown from './LinksDropdown';
import Logo from './Logo';
import NavSearch from './NavSearch';

function Navbar() {
  return (
    <nav className="border-b">
      <div
        className="container flex flex-col sm:flex-row sm:justify-between
      sm:items-center flex-wrap gap-4 py-8"
      >
        {/* containerクラスのCSSはglocal.cssで規定。layoutでメインコンテンツにも同じクラスを置いてる点に留意 */}
        <Logo />
        <NavSearch />
        <div className="flex items-center gap-4">
          <ModeToggle />
          <LinksDropdown />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;

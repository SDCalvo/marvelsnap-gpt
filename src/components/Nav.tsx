import Link from "next/link";
import { useRouter } from "next/router";
import baseStyles from "@/styles/nav.module.css";

const Nav = () => {
  const router = useRouter();

  return (
    <nav className={baseStyles.navContainer}>
      <ul className={baseStyles.navList}>
        {router.pathname !== "/" && (
          <li className={baseStyles.navItem}>
            <Link href="/" className={baseStyles.navLinkContainer}>
              <p className={baseStyles.navLink}>Home</p>
            </Link>
          </li>
        )}

        {router.pathname !== "/assistant" && (
          <li className={baseStyles.navItem}>
            <Link href="/assistant" className={baseStyles.navLinkContainer}>
              <p className={baseStyles.navLink}>Assistant</p>
            </Link>
          </li>
        )}

        {router.pathname !== "/about" && (
          <li className={baseStyles.navItem}>
            <Link href="/about">
              <p className={baseStyles.navLink}>About</p>
            </Link>
          </li>
        )}
        {/* Add more links here if needed */}
      </ul>
    </nav>
  );
};

const withNav = (WrappedComponent: any) => {
  return function WithNavComponent(props: any) {
    return (
      <>
        <Nav />
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withNav;

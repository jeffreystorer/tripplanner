import { Navigate, NavLink, Outlet } from 'react-router-dom';
import ScrollToTop from 'react-scroll-to-top';
import Logo from '../../assets/android-chrome-512x512.svg';
import '@/styles/index.css';

export default function LayoutPage() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  return (
    <>
      {isLoggedIn ? (
      <>
        <ScrollToTop />
        <header>
          <div>
            {/* <img alt='Logo' src={Logo} width='30' height='30'/> */}
            <h1>Storer TP</h1>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/pages/trip"
                  className={({isActive}) => isActive ? "active" : "inactive"}
                >
                  Trips
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pages/itinerary"
                  className={({isActive}) => isActive ? "active" : "inactive"}
                >
                  Itinerary
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className={({isActive}) => isActive ? "active" : "inactive"}
                >
                  Sign Out
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </>
      ) : (
        <Navigate to='/' />
      )
      }
    </>
  );
}

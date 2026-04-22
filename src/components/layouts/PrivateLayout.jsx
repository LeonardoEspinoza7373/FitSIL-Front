import { Outlet } from "react-router-dom";
import GlobalNavbar from "../Navbar/GlobalNavbar";

const PrivateLayout = () => {
  return (
    <>
      <GlobalNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PrivateLayout;

import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <div>Navbar</div>
      <Outlet></Outlet>
    </div>
  );
}

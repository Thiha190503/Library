import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { SwitchTransition, CSSTransition } from "react-transition-group";

export default function Layout() {
  const location = useLocation();
  return (
    <div>
      <Navbar></Navbar>
      <SwitchTransition>
        <CSSTransition timeout={200} classNames="fade" key={location.pathname}>
          <Outlet></Outlet>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

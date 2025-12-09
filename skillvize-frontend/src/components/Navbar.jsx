import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../assets/My-icon.png"

const navigation = [
  { name: "Home", path: "/" },
  { name: "Analysis", path: "/analysis" },
  { name: "Roadmap", path: "/roadmap" },
  { name: "About", path: "/about" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();

  // Dummy user for UI → Replace with logged-in user later
  /*const user = {
    gmail: "naveen@gmail.com",
    name: "Naveen",
  };*/

  const userdetails = JSON.parse(localStorage.getItem("user"));
  console.log(userdetails)
  const user = userdetails["name"];
  const gmail = userdetails["gmail"];

  const firstLetter =
    user?.charAt(0)?.toUpperCase() ||
    gmail?.charAt(0)?.toUpperCase() ||
    "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Disclosure as="nav" className="fixed top-0 z-50 bg-black w-full shadow-2xl border-b-[0.5px] border-white/20">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <DisclosureButton className="rounded-md p-2 text-gray-300 hover:text-white">
              <Bars3Icon className="block size-6 ui-open:hidden" />
              <XMarkIcon className="hidden size-6 ui-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo + Nav links */}
          <div className="flex items-center gap-10">
            <img
              src={Icon}
              className="h-8 w-auto hover:bg-[oklch(70.7% 0.022 261.325)] cursor-pointer"
              alt="logo"
              onClick={() => navigate("/")}
            />

            <div className="hidden sm:flex gap-6">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "text-white border-b-2 border-blue-400"
                        : "text-gray-300 hover:text-white",
                      "px-2 py-1 text-[15px] font-medium transition"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-5">
            <BellIcon className="size-6 text-gray-300 hover:text-white cursor-pointer" />

            {/* Profile Dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="bg-violet-800 text-white rounded-full w-9 h-9 flex items-center justify-center font-medium">
                {firstLetter}
              </MenuButton>

              <MenuItems className="absolute right-0 z-20 mt-2 w-40 rounded-md bg-gray-800 py-1 border border-gray-700 focus:outline-none">
                <p className="text-white text-center px-2 py-2 hover:underline cursor-pointer">{gmail}</p>
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700 font-medium"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>

        {/* Mobile menu */}
        <DisclosurePanel className="sm:hidden pb-3 pt-2">
          <div className="flex flex-col space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-900 hover:text-white",
                    "rounded-md px-3 py-2 text-base font-medium"
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </DisclosurePanel>
      </div>
    </Disclosure>
  );
}

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { cs } from "date-fns/locale";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

function Header({ placeholder }) {
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState("primaryNav");
  const menuRef = useRef();
  const router = useRouter();

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const resetInput = () => {
    setSearchInput("");
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target) && window.innerWidth < 1910) {
        setMenuOpen("primaryNav");
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <header className="fixed top-0 left-0 right-0 xl:right-66 flex justify-between h-16 z-40 bg-white pl-4 pr-3 py-1 border-b border-slate-500 transition duration-200 ease-out lg:pl-8 lg:pr-7 xl:pr-3">
      {/* left */}
      <div onClick={() => router.push("/")} className=" flex items-center">
        <h1 className="text-xl cursor-pointer">
          StandUp<span className="text-xl text-gray-500 ">.cz</span>
        </h1>
      </div>

      {/* right */}
      <div className="flex items-center space-x-4 text-gray-500">
        <div className="border-r-2 ">
          <Link className="cursor-default" href="#">
            <MagnifyingGlassIcon className="mx-3 h-10 text-gray-600 rounded-full p-2 cursor-default" />
          </Link>
        </div>
        <div className="flex items-center space-x-3 rounded-full">
          <UserCircleIcon
            className="h-10 p-1 cursor-pointer active:scale-95  hover:text-red-400"
            onClick={() => {
              router.push("/account");
            }}
          />
          <div ref={menuRef}>
            <Bars3Icon
              className="xl:hidden h-8 text-black cursor-pointer active:scale-95 hover:text-red-400"
              onClick={() => {
                setMenuOpen("translate-x-0 primaryNav");
              }}
            />
            <nav className={menuOpen}>
              <Bars3Icon
                className="xl:invisible h-8 pr-3 lg:pr-7 mt-4 ml-auto cursor-pointer active:scale-95 hover:text-white"
                onClick={() => {
                  setMenuOpen("primaryNav");
                }}
              />
              <ul className="text-stone-400 mx-11 mt-6 mb-11">
                <li
                  className={
                    router.pathname == "/" ? "menuLink activeLi" : "menuLink"
                  }
                >
                  <Link href="/">Vystoupení</Link>
                </li>
                <li
                  className={
                    router.pathname == "/account"
                      ? "menuLink activeLi"
                      : "menuLink"
                  }
                >
                  <Link href="/account" className="flex items-center">
                    Přidat/Odebrat vystoupení
                    {/* <PlusCircleIcon className="h-5 ml-2" /> */}
                  </Link>
                </li>

                <li className="">
                  <Link className="cursor-default" href="#">
                    Kontakt
                  </Link>
                </li>
              </ul>
              <div className="border border-gray-500 mb-11 w-52 mx-auto" />
              <div className=" w-16 flex items-center  justify-between mx-auto text-stone-400">
                <a
                  className="hover:text-white"
                  target="_blank"
                  href="https://www.linkedin.com/in/kucerazdenek/"
                >
                  <FontAwesomeIcon className="h-6 " icon={faLinkedin} />
                </a>
                <a
                  className="hover:text-white"
                  target="_blank"
                  href="https://github.com/zdenekdev"
                >
                  <FontAwesomeIcon className="h-6" icon={faGithub} />
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

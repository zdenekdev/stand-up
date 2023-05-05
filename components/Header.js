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
import {
  faFacebook,
  faFacebookF,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
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
    <header className="fixed top-0 left-0 right-0 xl:right-64 flex justify-between h-16 z-40 bg-white pl-8 pr-5 py-1  border-b border-slate-500 transition duration-200 ease-out">
      {/* left */}
      <div onClick={() => router.push("/")} className=" flex items-center">
        <h1 className="text-xl cursor-pointer">
          Vystoupeni<span className="text-xl text-gray-500 ">.cz</span>
        </h1>
      </div>

      {/* right */}
      <div className="flex items-center space-x-4 text-gray-500">
        <div className="border-r-2 ">
          <Link href="#">
            <MagnifyingGlassIcon className="mx-3 h-10 text-gray-600 rounded-full p-2 cursor-pointer  active:scale-95 hover:text-red-400" />
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
              className="xl:hidden h-10 p-1 text-black cursor-pointer active:scale-95  hover:text-red-400"
              onClick={() => {
                setMenuOpen("translate-x-0 primaryNav");
              }}
            />
            <nav className={menuOpen}>
              <Bars3Icon
                className="xl:invisible h-10 p-1 mr-5 mt-3 ml-auto cursor-pointer active:scale-95  hover:text-white"
                onClick={() => {
                  setMenuOpen("primaryNav");
                }}
              />
              <ul className="text-slate-300 mx-11 mt-6 mb-11">
                <li className="menuLink">
                  <Link href="/">Vystoupení</Link>
                </li>
                <li className="relative menuLink">
                  <Link href="/account" className="flex items-center">
                    Přidat vystoupení
                    <PlusCircleIcon className="h-5 ml-2" />
                  </Link>
                </li>

                <li className="menuLink">
                  <Link href="#">Videa</Link>
                </li>
                <li className="menuLink">
                  <Link href="#">Kontakt</Link>
                </li>
              </ul>
              <div className="border border-gray-500 mb-11 w-52 mx-auto" />
              <div className=" w-24 flex items-center  justify-between mx-auto text-slate-300">
                <a className="hover:text-white" href="#">
                  <FontAwesomeIcon className="h-4 " icon={faFacebookF} />
                </a>
                <a className="hover:text-white" href="#">
                  <FontAwesomeIcon className="h-5" icon={faInstagram} />
                </a>
                <a className="hover:text-white" href="#">
                  <FontAwesomeIcon className="h-6 " icon={faYoutube} />
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

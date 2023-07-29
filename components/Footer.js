import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faFacebookF,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

function Footer() {
  return (
    <div className="flex py-7 mt-10 bg-gray-100">
      <div className="flex justify-between mx-auto w-11/12 max-w-5xl">
        <div className="text-sm text-gray-800 flex flex-col">
          <h5 className="font-bold">Standup.cz</h5>

          <Link className="linkHover" href="/">
            Vystoupení
          </Link>
          <Link className="linkHover" href="/account">
            Přidat/Odebrat vystoupení
          </Link>

          <a className="cursor-default" href="#">
            Kontakt
          </a>
        </div>
        <div className=" w-28 flex items-center justify-between">
          <a className="linkHover" href="#">
            <FontAwesomeIcon className="h-5 " icon={faFacebookF} />
          </a>
          <a className="linkHover" href="#">
            <FontAwesomeIcon className="h-6" icon={faInstagram} />
          </a>
          <a className="linkHover" href="#">
            <FontAwesomeIcon className="h-7 " icon={faYoutube} />
          </a>
        </div>
      </div>
    </div>
  );
}
export default Footer;

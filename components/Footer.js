import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

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
        <div className=" w-16 flex items-center justify-between">
          <a
            className="linkHover text-gray-600"
            target="_blank"
            href="https://www.linkedin.com/in/kucerazdenek/"
          >
            <FontAwesomeIcon className="h-6" icon={faLinkedin} />
          </a>
          <a
            className="linkHover text-gray-600"
            target="_blank"
            href="https://github.com/zdenekdev"
          >
            <FontAwesomeIcon className="h-6" icon={faGithub} />
          </a>
        </div>
      </div>
    </div>
  );
}
export default Footer;

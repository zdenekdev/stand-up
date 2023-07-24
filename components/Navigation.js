import React, { useState } from "react";

function Navigation() {
  const [open, setOpen] = useState(false);
  let toggleClassCheck = open ? "active" : "";

  const handleClick = () => {
    setOpen((open) => !open);
  };
  return (
    <div
      className={`${toggleClassCheck} h-15 border-b flex justify-left items-start `}
    >
      <button
        className="m-5 cursor-pointer hover:text-red-400 outline-none"
        onClick={handleClick}
      >
        Česko
      </button>
      <div>Content</div>
    </div>
  );
}

export default Navigation;

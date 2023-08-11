import React from "react";

function Performance({ city, date, description, performer, place, url }) {
  const eventDate = date;

  return (
    <div className="flex flex-col border border-slate-500 rounded-lg">
      <div>
        <img
          className=" rounded-tl-lg rounded-tr-lg w-full object-cover aspect-1/1.5"
          src={url}
        />
      </div>

      <div className="flex flex-col flex-grow p-4">
        <p className="text-2xl font-semibold pt-2">{performer}</p>
        <div className="border-b border-slate-500 w-10 py-1" />
        <div className="py-2 font-semibold">
          <p>{`${city} - ${place}, ${eventDate}`}</p>
        </div>
        <div className="flex-1">{description}</div>
        <button className="button w-min whitespace-nowrap mt-3">
          Více informací
        </button>
      </div>
    </div>
  );
}

export default Performance;

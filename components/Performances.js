import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { format, setDate, toDate } from "date-fns";
import { cs } from "date-fns/locale";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { colRef, db } from "../firebase";
import {
  selectAfter,
  selectBefore,
  selectCountry,
  selectDateRangeT,
  selectFilter,
  selectPlace,
} from "../slices/filterSlice";
import DRangePicker from "./filterMenu/FilterDateRange";
import FilterCities from "./filterMenu/FilterCities";
import Forms from "./Forms";
import Navigation from "./Navigation";
import Button from "./Navigation";
import Performance from "./Performance";
import FilterDateRange from "./filterMenu/FilterDateRange";
import { connectStorageEmulator } from "firebase/storage";
import FilterCountries from "./filterMenu/FilterCountries";
import store from "../store";
import { ClickAwayListener } from "@mui/base";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ReactLoading from "react-loading";

function Performances() {
  // date range picker --

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState("hidden");
  const [noResults, setNoResults] = useState("hidden");
  const [results, setResults] = useState("");

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const formattedStartDate = format(new Date(startDate), "dd.M. ");
  const formattedEndDate = format(new Date(endDate), "dd.M.yyyy");
  const range = `${formattedStartDate} - ${formattedEndDate}`;

  //get collection data --
  const arrPerformances = [];

  const [performances, setPerformances] = useState([]);
  const [prePerformances, setPrePerformances] = useState();

  const [date, setdate] = useState(range);

  const filter = useSelector(selectFilter);
  const country = useSelector(selectCountry);
  const cityTitle = useSelector(selectPlace);
  const dateRangeTitle = useSelector(selectDateRangeT);
  const beforeDate = useSelector(selectBefore);
  const afterDate = useSelector(selectAfter);

  const [selected, setSelected] = useState();
  const router = useRouter();

  const navData = [
    {
      title: country,
      content: <FilterCountries />,
    },
    {
      title: cityTitle,
      content: <FilterCities />,
    },
    {
      title: dateRangeTitle,
      content: <FilterDateRange selected={selected} />,
    },
  ];

  const handle = (e) => {
    setCityy(e.target.value);
  };

  const handleChangeDate = (e) => {};

  const now = "2023-03-14";

  const funkce = () => {
    setLoading("");
    setNoResults("hidden");
    setResults("hidden");
    let q;
    if (
      cityTitle === "Všechna města" &&
      beforeDate === null &&
      afterDate === null
    ) {
      q = query(
        collection(db, "vystoupeni"),
        where("country", "==", country),
        orderBy("date")
      );
    } else if (
      cityTitle !== "Všechna města" &&
      beforeDate === null &&
      afterDate === null
    ) {
      q = query(
        collection(db, "vystoupeni"),
        where("city", "==", cityTitle),
        where("country", "==", country),
        orderBy("date")
      );
    } else if (
      cityTitle === "Všechna města" &&
      beforeDate !== null &&
      afterDate !== null
    ) {
      q = query(
        collection(db, "vystoupeni"),
        where("country", "==", country),
        where("date", ">=", afterDate),
        where("date", "<=", beforeDate),
        orderBy("date")
      );
    } else if (
      cityTitle !== "Všechna města" &&
      beforeDate !== null &&
      afterDate !== null
    ) {
      q = query(
        collection(db, "vystoupeni"),
        where("country", "==", country),
        where("city", "==", cityTitle),
        where("date", ">=", afterDate),
        where("date", "<=", beforeDate),
        orderBy("date")
      );
    }
    getDocs(q)
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          arrPerformances.push({ ...doc.data(), id: doc.id });
        });
        setPerformances(arrPerformances);
      })
      .then(() => {
        arrPerformances.length === 0
          ? (setLoading("hidden"), setNoResults(""), setResults("hidden"))
          : (setLoading("hidden"), setNoResults("hidden"), setResults(""));
      });
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  useEffect(() => {
    funkce();
    setSelected(null);
    router.push({
      query: {
        place: filter.place,
        after: format(new Date(startDate), "yyyy-MM-dd"),
        before: format(new Date(endDate), "yyyy-MM-dd"),
      },
    });
  }, [filter]);

  // navigation --

  const toggle = (i) => {
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
  };

  const changeSelected = () => {
    console.log("změnilo se");
    return "content";
  };

  let menuRef = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  useEffect(() => {
    let handler = (e) => {
      const index = [];
      menuRef.current.forEach((menu) => {
        index.push(!menu.current.contains(e.target));
      });
      const menuIndex = index.findIndex((f) => f === false);
      if (menuIndex === -1) {
        setSelected(null);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className="flex flex-col lg:items-stretch">
      <div className="lg:border-b border-slate-500 lg:px-8 lg:fixed relative top-16 lg:left-0 right-0 xl:right-64 bg-white z-30">
        <div className="flex flex-col lg:flex-row lg:justify-left outline-none select-none">
          <div className="flex flex-1 max-w-5xl lg:mx-auto">
            <div className="flex flex-col flex-1 lg:flex-row">
              {navData.map((item, i) => (
                <div className="border-b border-slate-500 lg:border-b-transparent relative px-8 lg:px-0">
                  <div
                    className="flex flex-col whitespace-nowrap mr-11"
                    ref={menuRef.current[i]}
                  >
                    <div
                      className="flex items-center hover:text-red-400 cursor-pointer "
                      onClick={() => toggle(i)}
                    >
                      <div className="my-5">{item.title}</div>
                      <span>
                        {selected === i ? (
                          <ChevronUpIcon className="h-4 mx-2 mt-1 -translate-y-px" />
                        ) : (
                          <ChevronDownIcon className="h-4 mx-2 translate-y-px" />
                        )}
                      </span>
                    </div>
                    <div
                      className={selected !== i ? "content" : "content active"}
                    >
                      {item.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" max-w-5xl self-center mt-16 lg:mt-32 flex flex-col mb-8 w-11/12">
        <h1 className="text-2xl my-8">
          {filter.place === "Všechna města" && filter.dateRangeT === "Kdykoliv"
            ? filter.country
            : filter.place !== "Všechna města" &&
              filter.dateRangeT === "Kdykoliv"
            ? `${filter.place}`
            : filter.place === "Všechna města" &&
              filter.dateRangeT !== "Kdykoliv"
            ? `${filter.country} ${filter.dateRangeT.toLowerCase()}`
            : `${filter.place} ${filter.dateRangeT.toLowerCase()}`}
        </h1>

        <div className={results}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {performances.map(
              ({ city, date, description, performer, place, url }) => (
                <Performance
                  city={city}
                  date={format(new Date(date), "d.M.yyyy")}
                  description={description}
                  performer={performer}
                  place={place}
                  url={url}
                />
              )
            )}
          </div>
        </div>
        <div className={noResults}>
          <div className="h-96 flex justify-center items-center flex-col  rounded-lg">
            <div className=" p-16 rounded-xl flex flex-col">
              <div>
                <MagnifyingGlassIcon className="h-8 text-red-400" />
                <h2
                  className="p-3
               text-xl"
                >
                  Pro tento výběr nebyly nalezeny žádné výsledky
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className={loading}>
          <div className="h-96 flex justify-center items-center flex-col  rounded-lg">
            <div className=" p-16 rounded-xl flex flex-col">
              <ReactLoading
                type={"spin"}
                color={"red"}
                width={60}
                height={60}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performances;

// import { addDays } from "date-fns/esm";
import { cs } from "date-fns/locale";
import { format, getDay, previousFriday } from "date-fns";
import React, { useEffect, useState } from "react";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  after,
  before,
  dateRangeT,
  selectDateRangeT,
  selectFilter,
} from "../../slices/filterSlice";
import {
  addDays,
  endOfDay,
  startOfDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  nextFriday,
} from "date-fns";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";

function FilterDateRange({ selected }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const router = useRouter();
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const selectedDateRange = useSelector(selectDateRangeT);
  const definedDates = {
    today: new Date(),
    tomorrow: addDays(new Date(), 1),
    friday: addDays(endOfWeek(new Date(), { weekStartsOn: 1 }), -2),
    sunday: endOfWeek(new Date(), { weekStartsOn: 1 }),
  };
  const dateRangeTitle = [
    { title: "Kdykoliv", date: "" },
    { title: "Dnes", date: format(definedDates.today, "d. M.") },
    { title: "Zítra", date: format(definedDates.tomorrow, "d. M.") },
    {
      title: "Tento týden",
      date: `${format(definedDates.today, "d. M.")} - ${format(
        definedDates.sunday,
        "d. M."
      )}`,
    },
    {
      title: "Tento víkend",
      date: `${format(definedDates.friday, "d. M.")} - ${format(
        definedDates.sunday,
        "d. M."
      )}`,
    },
  ];
  const [customDrMenu, setCustomDrMenu] = useState("toggle show");

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const formattedStartDate = format(new Date(startDate), "d.M. ");
  const formattedEndDate = format(new Date(endDate), "d.M.yyyy");
  const range = `${formattedStartDate} - ${formattedEndDate}`;

  useEffect(() => {
    if (selectedDateRange === "Kdykoliv") {
      dispatch(after(null));
      dispatch(before(null));
      setStartDate(new Date());
      setEndDate(new Date());
    } else if (selectedDateRange === "Dnes") {
      dispatch(after(format(definedDates.today, "yyyy-MM-dd")));
      dispatch(before(format(definedDates.today, "yyyy-MM-dd")));
      setStartDate(definedDates.today);
      setEndDate(definedDates.today);
    } else if (selectedDateRange === "Zítra") {
      dispatch(after(format(definedDates.tomorrow, "yyyy-MM-dd")));
      dispatch(before(format(definedDates.tomorrow, "yyyy-MM-dd")));
      setStartDate(definedDates.tomorrow);
      setEndDate(definedDates.tomorrow);
    } else if (selectedDateRange === "Tento týden") {
      dispatch(after(format(definedDates.today, "yyyy-MM-dd")));
      dispatch(before(format(definedDates.sunday, "yyyy-MM-dd")));
      setStartDate(definedDates.today);
      setEndDate(definedDates.sunday);
    } else if (selectedDateRange === "Tento víkend") {
      dispatch(after(format(definedDates.friday, "yyyy-MM-dd")));
      dispatch(before(format(definedDates.sunday, "yyyy-MM-dd")));
      setStartDate(definedDates.friday);
      setEndDate(definedDates.sunday);
    }
  }, [selectedDateRange]);

  useEffect(() => {
    setCustomDrMenu("toggle");

    // router.push({
    //   query: {
    //     country: filter.country
    //       .normalize("NFD")
    //       .replace(/[\u0300-\u036f]/g, "")
    //       .toLowerCase(),
    //     place: filter.place
    //       .normalize("NFD")
    //       .replace(/[\u0300-\u036f]/g, "")
    //       .toLowerCase(),
    //     date: filter.dateRangeT
    //       .normalize("NFD")
    //       .replace(/[\u0300-\u036f]/g, "")
    //       .toLowerCase(),
    //   },
    // });
  }, [filter]);

  const search = () => {
    dispatch(after(format(new Date(startDate), "yyyy-MM-dd")));
    dispatch(before(format(new Date(endDate), "yyyy-MM-dd")));
    dispatch(
      dateRangeT(
        `${format(new Date(startDate), "dd. M.")} - ${format(
          new Date(endDate),
          "dd. M. yyyy"
        )}`
      )
    );
  };

  useEffect(() => {
    if (selected === null) {
      setCustomDrMenu("toggle show");
    }

    setCustomDrMenu("toggle");
  }, [selected]);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className={customDrMenu}>
        <div className="flex-grow">
          <ul>
            {dateRangeTitle.map((dRange, i) => (
              <li
                key={i}
                className="filterBtn flex justify-between"
                onClick={() => {
                  dispatch(dateRangeT(dRange.title));
                }}
              >
                {dRange.title}
                <span>{dRange.date}</span>
              </li>
            ))}
          </ul>
          <button
            className="filterBtn flex justify-between flex-grow w-full"
            onClick={() => setCustomDrMenu("toggle show")}
          >
            Jiné Datum
            <span>Vybrat dny</span>
          </button>
        </div>
        <div className="mt-10 xsm:h-108 h-124">
          <button
            className="filterBtn"
            onClick={() => setCustomDrMenu("toggle")}
          >
            Zpět
          </button>
          <div className="ml-auto mr-auto flex flex-col flex-grow items-center mt-5 justify-between h-full">
            <DateRange
              minDate={new Date()}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              ranges={[selectionRange]}
              locale={cs}
              showMonthAndYearPickers={false}
              showDateDisplay={false}
              // rangeColors={["#34495e"]}
              rangeColors={["#FD5B61"]}
            />

            <div className="flex flex-col xsm:flex-row">
              <div className="mx-5 flex border-2 border-slate-500  w-40 rounded-lg justify-center">
                <h1 className=" p-2 rounded-md bg-red">{range}</h1>

                {/* <TextField
                  className="outline-none "
                  id="outlined-read-only-input"
                  label="Vybrané dny"
                  defaultValue={range}
                  InputProps={{
                    readOnly: true,
                  }}
                /> */}
              </div>
              <ChevronDoubleRightIcon className="self-center h-4 mx-2 -translate-y-px invisible xsm:visible" />
              <button
                className="mx-5 bg-red-400 text-white px-5 py-2  rounded-xl border-2 border-red-400 hover:shadow-lg active:scale-95"
                onClick={search}
              >
                Vyhledat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterDateRange;

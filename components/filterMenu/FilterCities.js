import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { place, selectCountry, selectPlace } from "../../slices/filterSlice";
import { selectCz, selectSk } from "../../slices/townsSlice";

function FilterCities() {
  const dispatch = useDispatch();
  const changePlace = useSelector(selectPlace);
  const changeCountry = useSelector(selectCountry);
  const czTowns = useSelector(selectCz);
  const skTowns = useSelector(selectSk);
  let cities = [...czTowns];

  useEffect(() => {
    if (changeCountry === "Česko") {
      dispatch(place("Všechna města"));
    } else if (changeCountry === "Slovensko") {
      dispatch(place("Všechna města"));
    }
  }, [changeCountry]);

  if (changeCountry === "Česko") {
    cities = czTowns;
  } else if (changeCountry === "Slovensko") {
    cities = skTowns;
  }

  return (
    <div className="text-lg font-light flex-grow">
      {changePlace === "Všechna města" ? null : (
        <div className="mb-3">
          <span className="filterBtn text-gray-500 font-light">
            Vybrané město:
          </span>
          <div className="flex items-center pb-2  hover:cursor-pointer text-red-400 justify-between">
            <div className="mt-2">{changePlace}</div>
            <TrashIcon
              className="h-6 translate-y-0.5"
              onClick={() => dispatch(place("Všechna města"))}
            />
          </div>
        </div>
      )}

      <div>
        <p className="filterBtn text-gray-500 font-light">Doporučená města:</p>
        <ul className="mt-2">
          {cities.map((city) => (
            <li className="filterBtn" onClick={() => dispatch(place(city))}>
              {city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FilterCities;

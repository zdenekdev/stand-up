import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { country, selectCountry } from "../../slices/filterSlice";

function FilterCountries() {
  const countries = ["Česko", "Slovensko"];
  const dispatch = useDispatch();
  const changeCountry = useSelector(selectCountry);

  return (
    <div className="text-lg font-light  flex-grow">
      <ul className="">
        {countries.map((cntry) => (
          <li className="filterBtn" onClick={() => dispatch(country(cntry))}>
            {cntry}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FilterCountries;

import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { colRef, db, app, auth } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Calendar } from "react-date-range";
import ReactDatePicker from "react-datepicker";
import { cs } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import { selectCz, selectSk } from "../slices/townsSlice";
import Link from "next/link";

function Forms() {
  const storage = getStorage(app);
  const czTowns = useSelector(selectCz);
  const skTowns = useSelector(selectSk);

  const inputCountry = useRef(null);
  const inputCity = useRef(null);
  const inputPlace = useRef(null);
  const inputPerformer = useRef(null);
  const inputPerformance = useRef(null);
  const [startDate, setStartDate] = useState(new Date());

  const inputDescription = useRef(null);
  const inputFile = useRef(null);

  const [imgFormat, setImgFormat] = useState(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const router = useRouter(null);
  const [userEmail, setUserEmail] = useState("");
  const [pictureSize, setPictureSize] = useState("formAlert hidden");
  const [isPicture, setIsPicture] = useState("formAlert hidden");

  const [characterCount, setCharacterCount] = useState(0);
  const [formAlert, setFormAlert] = useState("formAlert hidden");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");

  const [addConfirmed, setAddConfirmed] = useState(false);
  const [removeSpinner, setRemoveSpinner] = useState(false);

  const [pictureAlertText, setPictureAlertText] = useState(
    "hidden formAlertText"
  );
  const [placeAlertText, setPlaceAlertText] = useState("hidden formAlertText");
  const [placeAlertBorder, setPlaceAlertBorder] = useState("input");
  const [performerAlertText, setPerformerAlertText] = useState(
    "hidden formAlertText"
  );
  const [deletePerformanceAlertText, setDeletePerformanceAlertText] = useState(
    "hidden formAlertText"
  );
  const [performerAlertBorder, setPerformerAlertBorder] = useState("input");
  const [descriptionAlertText, setDescriptionAlertText] = useState(
    "hidden formAlertText"
  );
  const [descriptionAlertBorder, setDescriptionAlertBorder] = useState("input");
  const [cities, setCities] = useState([...czTowns]);

  const [performances, setPerformances] = useState([]);
  const [performancesLength, setPerformancesLength] = useState(
    performances.length
  );

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const addPerformance = (e) => {
    e.preventDefault();
    let isValid = true;

    !inputFile.current.value
      ? (setPictureAlertText("formAlertText"), (isValid = false))
      : setPictureAlertText("hidden");

    !inputPlace.current.value.length
      ? (setPlaceAlertBorder("input border-red-500"),
        setPlaceAlertText("formAlertText"),
        (isValid = false))
      : (setPlaceAlertBorder("input border-slate-500"),
        setPlaceAlertText("hidden"));

    !inputPerformer.current.value.length
      ? (setPerformerAlertBorder("input border-red-500"),
        setPerformerAlertText("formAlertText"),
        (isValid = false))
      : (setPerformerAlertBorder("input border-slate-500"),
        setPerformerAlertText("hidden"));

    !inputDescription.current.value.length
      ? (setDescriptionAlertBorder("input border-red-500"),
        setDescriptionAlertText("formAlertText"),
        (isValid = false))
      : (setDescriptionAlertBorder("input"), setDescriptionAlertText("hidden"));

    if (isValid === true) {
      setAddConfirmed(true);
      setFormAlert("formAlert hidden");
      const uploadTask = ref(storage, `/images/${file.name}`);
      setImage(null);

      uploadBytesResumable(uploadTask, file).on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error adding document: ", e);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(
            uploadBytesResumable(uploadTask, file).snapshot.ref
          ).then((downloadURL) => {
            try {
              const docRef = addDoc(colRef, {
                country: inputCountry.current.value,
                city: inputCity.current.value,
                place: inputPlace.current.value,
                performer: inputPerformer.current.value,
                date: format(new Date(startDate), "yyyy-MM-dd"),
                description: inputDescription.current.value,
                url: downloadURL,
              })
                .then(() => {
                  inputFile.current.value = null;
                  // inputCity.current.value = "";
                  inputPlace.current.value = "";
                  setStartDate(new Date());
                  inputPerformer.current.value = "";
                  inputDescription.current.value = "";
                  setCharacterCount(0);
                })
                .then(() => {
                  setImage([downloadURL]);
                })
                .then(() => {
                  setAddConfirmed(false);
                  setDialogText("Vystoupení vloženo");
                  setDialogOpen(true);
                  restoreData();
                });
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          });
        }
      );
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setImgFormat(e.target.files[0].type);
      setImage(URL.createObjectURL(e.target.files[0]));
      e.target.files[0].size > 500000
        ? setPictureSize("formAlert")
        : setPictureSize("formAlert hidden");
      e.target.files[0].type.includes("image")
        ? setIsPicture("formAlert hidden")
        : setIsPicture("formAlert");
    } else {
      setPictureSize("formAlert hidden");
      setIsPicture("formAlert hidden");
    }
  };

  const signOutAcc = () => {
    router.push("/");
    signOut(auth);
  };

  const handleCityChange = () => {
    const curCountry = inputCountry.current.value;
    if (curCountry === "Česko") {
      setCities([...czTowns]);
    } else {
      setCities([...skTowns]);
    }
  };

  const removePerformance = async (e) => {
    e.preventDefault();
    if (inputPerformance.current.value === "default") {
      setDeletePerformanceAlertText("formAlertText");
    } else {
      try {
        setRemoveSpinner(true);
        setDeletePerformanceAlertText("hidden formAlertText");
        e.preventDefault();
        const colRef = doc(db, "vystoupeni", inputPerformance.current.value);
        await deleteDoc(colRef);
        await restoreData();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const restoreData = async () => {
    try {
      const q = query(collection(db, "vystoupeni"), orderBy("date"));
      const snapshot = await getDocs(q);

      setPerformances(
        snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setPerformancesLength((prev) => {
      if (prev > performances.length) {
        setRemoveSpinner(false);
        setDialogText("Vystoupení smazáno");
        setDialogOpen(true);
      }
      return performances.length;
    });
  }, [performances]);

  useEffect(() => {
    restoreData();
  }, []);

  return (
    <div className="flex flex-1 flex-col w-full mt-16 ml-auto mr-auto justify-center items-center lg:items-baseline lg:flex-row">
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent>
          <DialogContentText className="flex flex-col items-center h-32 w-56 justify-center">
            <XCircleIcon
              className="h-7 absolute top-1 right-1 cursor-pointer"
              onClick={() => setDialogOpen(false)}
            />
            <CheckCircleIcon className="h-12 text-green-300" />
            <p className="text-xl ">{dialogText}</p>
            <Link href="/" className="text-sm pt-1 underline">
              Přejít do sekce Vystoupení
            </Link>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <div className="self-end mb-2 hidden">
        <span className="mr-4 in invisible">{`účet: ${userEmail}`}</span>
        <button
          onClick={signOutAcc}
          className="self-end m-4 hover:text-red-400 mr-4 invisible"
        >
          Odhlásit se
        </button>
      </div>
      <div className="p-5 border shadow-md rounded-lg w-11/12 max-w-md mt-12 ml-4 mr-4">
        <h2 className="text-xl font-semibold">Přidat vystoupení</h2>
        <div className="border-b border-slate-500 mb-5 mt-2 w-10" />

        <form className=" flex flex-col">
          <div className="inputDiv">
            <div className="flex items-center">
              <label className="" htmlFor="picture">
                Obrázek:
              </label>
              <InformationCircleIcon
                className="h-5 ml-1 text-black-500"
                data-tooltip-id="my-tooltip"
                data-tooltip-html="
                Maximální velikost obrázku je 500KB<br/>Ideální poměr stran 3:2"
                data-tooltip-offset={6}
              />
              <Tooltip id="my-tooltip" />
            </div>

            <input
              className="mt-1"
              ref={inputFile}
              type="file"
              onChange={handleChange}
              required
            />

            <div className={pictureSize}>
              <ExclamationCircleIcon className="text-red-400 h-6" />
              <p className="pl-4">Maximální velikost obrázku je 500KB</p>
            </div>

            <div className={isPicture}>
              <ExclamationCircleIcon className="text-red-400 h-6" />
              <p className="pl-4">Vložený soubor není obrázek</p>
            </div>

            <p className={pictureAlertText}>Vložte prosím obrázek</p>
          </div>

          <div className="inputDiv">
            <label htmlFor="mesto">Země:</label>
            <select
              name="country"
              id=""
              className="p-1 rounded-md input bg-white cursor-pointer"
              ref={inputCountry}
              onChange={handleCityChange}
            >
              <option value="Česko">Česko</option>
              <option value="Slovensko">Slovensko</option>
            </select>
          </div>

          <div className="inputDiv">
            <label htmlFor="mesto">Město:</label>
            <select
              name="mesto"
              id=""
              className="p-1 rounded-md input bg-white cursor-pointer"
              ref={inputCity}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="inputDiv">
            <label htmlFor="misto">Místo:</label>
            <input
              className={placeAlertBorder}
              ref={inputPlace}
              type="text"
              name="misto"
              maxLength="40"
              required
            />
            <p className={placeAlertText}>Zadejte prosím místo vystoupení.</p>
          </div>

          <div className="inputDiv">
            <label htmlFor="vystupujici">Vystupující:</label>
            <input
              className={performerAlertBorder}
              ref={inputPerformer}
              type="text"
              name="performer"
              maxLength="45"
              required
            />
            <p className={performerAlertText}>
              Zadejte prosím jméno vystupujícího.
            </p>
          </div>

          <div className="inputDiv">
            <label htmlFor="datum">Datum:</label>
            <ReactDatePicker
              // withPortal
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              locale={cs}
              showIcon
              className="input w-full pl-10 bg-transparent cursor-pointer"
              dateFormat="d.M.yyyy"
              popperModifiers={[
                {
                  name: "offset",
                  options: {
                    offset: [0, -10],
                  },
                },
              ]}
            />
            <CalendarDaysIcon className="h-6 absolute left-2 top-1/2 text-slate-600 -z-10" />
          </div>

          <div className="inputDiv">
            <label htmlFor="datum">Popis:</label>
            <textarea
              className={descriptionAlertBorder}
              ref={inputDescription}
              type="text"
              name="description"
              required
              rows="4"
              maxLength="150"
              onChange={(e) => {
                setCharacterCount(e.target.value.length);
              }}
            />
            <p className={descriptionAlertText}>Zadejte prosím popis.</p>
            <p className="absolute right-0 -bottom-6 text-right justify-self-end text-gray-500 text-sm">{`${characterCount}/150`}</p>
          </div>

          <button
            type="submit"
            onClick={addPerformance}
            className="button w-40 ml-auto mr-auto mt-5"
          >
            Vložit vystoupení
            {addConfirmed && (
              <ReactLoading
                type={"spin"}
                color={"red"}
                width={40}
                height={40}
                className="spinner"
              />
            )}
          </button>
        </form>
      </div>

      <div className="p-5 border shadow-md rounded-lg w-11/12 max-w-md mt-12 h-max ml-4 mr-4">
        <h2 className="text-xl font-semibold">Odebrat vystoupení</h2>
        <div className="border-b border-slate-500 mb-5 mt-2 w-10" />
        <form className="flex flex-col">
          <div className="inputDiv">
            <select
              name="perfomance"
              id=""
              className="p-1 rounded-md input bg-white cursor-pointer"
              ref={inputPerformance}
            >
              <option key="default" value="default">
                Vyberte vystoupení
              </option>
              {performances.length > 0 &&
                performances.map((perf) => {
                  return (
                    <option key={perf.id} value={perf.id}>
                      {`${format(new Date(perf.date), "d.M.yyyy")} - ${
                        perf.performer
                      } - ${perf.city}`}
                    </option>
                  );
                })}
            </select>
            <p className={deletePerformanceAlertText}>
              Vyberte prosím vystoupení.
            </p>
          </div>

          <button
            onClick={removePerformance}
            type="submit"
            className="button bg-red-400 active:bg-red-400 text-white w-50 ml-auto mr-auto mt-5"
          >
            Odstranit vystoupení
            {removeSpinner && (
              <ReactLoading
                type={"spin"}
                color={"red"}
                width={40}
                height={40}
                className="spinner"
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Forms;

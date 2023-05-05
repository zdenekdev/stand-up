import { signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { colRef, removePerformance, db, app, auth } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Calendar } from "react-date-range";
import ReactDatePicker from "react-datepicker";
import { cs } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import ReactLoading from "react-loading";

function Forms() {
  const storage = getStorage(app);

  const inputCountry = useRef(null);
  const inputCity = useRef(null);
  const inputPlace = useRef(null);
  const inputPerformer = useRef(null);
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
  const [loading, setLoading] = useState("spinner hidden");

  const [pictureAlertText, setPictureAlertText] = useState(
    "hidden formAlertText"
  );
  const [placeAlertText, setPlaceAlertText] = useState("hidden formAlertText");
  const [placeAlertBorder, setPlaceAlertBorder] = useState("input");
  const [performerAlertText, setPerformerAlertText] = useState(
    "hidden formAlertText"
  );
  const [performerAlertBorder, setPerformerAlertBorder] = useState("input");
  const [descriptionAlertText, setDescriptionAlertText] = useState(
    "hidden formAlertText"
  );
  const [descriptionAlertBorder, setDescriptionAlertBorder] = useState("input");

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
      setLoading("spinner");
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
                  inputCity.current.value = "";
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
                  setLoading("spinner hidden");
                  setDialogOpen(true);
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

  return (
    <div className="flex flex-1 flex-col items-center  mt-16">
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent>
          <DialogContentText className="flex items-center h-32 w-96 justify-center">
            <XCircleIcon
              className="h-7 absolute top-1 right-1 cursor-pointer"
              onClick={() => setDialogOpen(false)}
            />
            <CheckCircleIcon className="h-12 text-green-300" />
            <p className="text-lg pl-1">Vystoupení vloženo</p>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <div className="self-end mb-2">
        <span className="mr-4 in invisible">{`účet: ${userEmail}`}</span>
        <button
          onClick={signOutAcc}
          className="self-end m-4 hover:text-red-400 mr-4 invisible"
        >
          Odhlásit se
        </button>
      </div>
      <div className="p-5  border border-slate-500 shadow-sm rounded-lg bg-gray-100 w-96 my-auto">
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
              className="p-1 rounded-md input"
              ref={inputCountry}
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
              className="p-1 rounded-md input"
              ref={inputCity}
            >
              <option value="Praha">Praha</option>
              <option value="Brno">Brno</option>
              <option value="Ostrava">Ostrava</option>
            </select>
          </div>

          <div className="inputDiv">
            <label htmlFor="misto">Místo:</label>
            <input
              className={placeAlertBorder}
              ref={inputPlace}
              type="text"
              name="misto"
              maxLength="30"
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
              maxLength="30"
              required
            />
            <p className={performerAlertText}>
              Zadejte prosím jméno vystupujícího.
            </p>
          </div>

          <div className="inputDiv">
            <label htmlFor="datum">Datum:</label>
            <ReactDatePicker
              showIcon
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              locale={cs}
              className="input w-full"
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

          {/* <div className={formAlert}>
            <ExclamationCircleIcon className="text-red-400 h-7" />
            <p className="pl-4">Opravte prosím chyby ve formuláři</p>
          </div> */}

          <button
            type="submit"
            onClick={addPerformance}
            className="button w-40 ml-auto mr-auto mt-5"
          >
            Vložit vystoupení
            <ReactLoading
              type={"spin"}
              color={"red"}
              width={40}
              height={40}
              className={loading}
            />
          </button>
        </form>
      </div>

      <div className="m-5 p-5  border-2 shadow-sm rounded-lg bg-gray-50 w-96 hidden">
        <h2 className="text-xl font-semibold">Odstranit vystoupení</h2>
        <div className="border-b w-10 mb-5 mt-2" />
        <form className="flex flex-col">
          <label className="mt-3" htmlFor="id">
            ID vystoupení:
          </label>
          <input className="input" type="text" name="id" required />
          <button
            onClick={removePerformance}
            type="submit"
            className="button bg-red-400 active:bg-red-400 text-white w-50 ml-auto mr-auto"
          >
            Odstranit vystoupení
          </button>
        </form>
      </div>
    </div>
  );
}

export default Forms;

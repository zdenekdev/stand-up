import { useRouter } from "next/router";
import React, { useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../firebase";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import GoogleButton from "react-google-button";

function Login() {
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const signIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        alert("You are signed in, hoooray!!");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const register = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        alert("jste registrován");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const forgotPassword = () => {
    sendPasswordResetEmail(auth, emailRef.current.value);
    alert(
      `Pokud zde máte registrovaný účet na email ${emailRef.current.value}, zkontrolujte prosím vaši e-mailovou schránku. Zaslali jsme Vám odkaz na obnovení vašeho hesla`
    );
  };

  const googleSignIn = () => {
    signInWithRedirect(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md ">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Přihlásit se
            </h2>
            {/* <div className=" mt-8">
              <GoogleButton
                type="light"
                label="Přihlásit se přes Google"
                onClick={googleSignIn}
              />
            </div> */}
          </div>
          <form className="space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  ref={emailRef}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-slate-500  focus:outline-none focus:ring-slate-500 sm:text-sm"
                  placeholder="Emailová adresa"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
                  placeholder="Heslo"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-red-400 focus:ring-red-200"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Pamatovat přihlášení
                </label>
              </div> */}

              <div className="text-sm ml-auto">
                <a
                  onClick={forgotPassword}
                  href="#"
                  className="font-medium text-red-400 hover:text-red-200"
                >
                  Zapomněli jste heslo?
                </a>
              </div>
            </div>

            <div>
              <button
                onClick={signIn}
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-400 py-2 px-4 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-red-200 group-hover:text-red-400"
                    aria-hidden="true"
                  />
                </span>
                Přihlásit se
              </button>
            </div>
            <div>
              <button
                onClick={register}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-gray-500 group-hover:text-gray-400"
                    aria-hidden="true"
                  />
                </span>
                Zaregistrovat se
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

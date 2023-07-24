import { useRouter } from "next/router";
import React, { useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Login from "../components/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Forms from "../components/Forms";

function Account() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* {!user ? <Login /> : <Forms />} */}

      <Forms />

      <Footer />
    </div>
  );
}

export default Account;

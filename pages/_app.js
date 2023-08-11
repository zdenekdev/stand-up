import "../styles/globals.css";
import ProgressBar from "@badrap/bar-of-progress";
import { Router } from "next/router";
import store from "../store";
import { Provider } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function App({ Component, pageProps }) {
  const progress = new ProgressBar({
    size: 2,
    color: "#FE595E",
    className: "z-50",
    delay: 100,
  });

  Router.events.on("routeChangeStart", progress.start);
  Router.events.on("routeChangeComplete", progress.finish);
  Router.events.on("routeChangeError", progress.finish);

  const [user, loading, error] = useAuthState(auth);

  return (
    <Provider store={store}>
      <div className="xl:mr-66 duration-200">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

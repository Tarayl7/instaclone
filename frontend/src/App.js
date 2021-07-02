import React from "react";
import { Router } from "@reach/router";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Homepage from "./components/Homepage";
import ProfilePage from "./components/ProfilePage";
import Edit from "./components/Edit";
import UserProfilePage from "./components/UserProfilePage";
import Messages from "./components/Messages";
import ErrorPage from "./components/ErrorPage";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Login path="/" />
          <SignUp path="/sign-up" />
          <Homepage path="/homepage" />
          <ProfilePage path="/profile-page" />
          <Edit path="/edit" />
          <UserProfilePage path="user-profile-page" />
          <Messages path="/messages" />
          <ErrorPage default />
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;

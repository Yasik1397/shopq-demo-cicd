import React, { useEffect, useState } from "react";

import AuthStack from "./AuthStack";
import UserStack from "./UserStack";

import SplashScreen from "../components/SplashScreen";

import { useDispatch } from "react-redux";
import { getUserData } from "../redux/Api/user";
import { GetValue } from "../utils/storageutils";
import { SettingsData } from "../redux/Api/User/Settings";

const AppStack = () => {
  const [initial, setinitial] = useState(true);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  async function onAuthStateChanged() {
    try {
      const getUser = await GetValue("user");
      const parsedUserData = getUser.data || null;
      if (getUser) {
        dispatch(getUserData({ id: parsedUserData?.id }));
        dispatch(SettingsData());
        setUserData(parsedUserData);
      } else {
        setUserData(null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching user data from EncryptedStorage:", error);
    }
  }
  useEffect(() => {
    onAuthStateChanged();
    if (userData) {
      dispatch(getUserData({ id: userData?.id }));
    }
  }, []);

  if (initial) {
    return <SplashScreen setinitial={setinitial} />;
  }

  return (
    <React.Fragment>
      {userData ? (
        <UserStack data={userData} onAuthStateChanged={onAuthStateChanged} />
      ) : (
        <AuthStack onAuthStateChanged={onAuthStateChanged} />
      )}
    </React.Fragment>
  );
};

export default AppStack;


import { persistor, store } from "../src/redux/store";
import { signOut } from "../src/redux/user/userSlice";


export const logoutUser = () => {
  store.dispatch(signOut());
  persistor.purge();
  window.location.href = "/signin";
};

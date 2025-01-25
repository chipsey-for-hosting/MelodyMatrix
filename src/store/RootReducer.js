import { combineReducers } from "redux";
import authReducer from "../reduces/authSlice";
import userReducer from "../reduces/userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

export default rootReducer;

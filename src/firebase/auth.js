import { app } from "./index";
import { getAuth } from "firebase/auth";

export const auth = getAuth(app);
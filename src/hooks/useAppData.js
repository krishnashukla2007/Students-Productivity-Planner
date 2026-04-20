import { useContext } from "react";
import { AppDataContext } from "../context/AppDataContext";

export function useAppData() {
  return useContext(AppDataContext);
}


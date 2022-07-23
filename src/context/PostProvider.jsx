import { createContext, useContext } from "react";

export const PostContext = createContext(null);

export const usePost = () => useContext(PostContext);

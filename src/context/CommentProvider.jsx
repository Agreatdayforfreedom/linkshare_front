import { createContext, useContext } from "react";

export const CommentContext = createContext(null);

export const useComment = () => useContext(CommentContext);

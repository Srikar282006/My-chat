import {create} from "zustand";

export const useThemeStore=create((set) => ({
    //we store it in local storage
    theme:localStorage.getItem("chat-Item") || "coffee",
    setTheme:(theme)=> {
        localStorage.setItem("chat-Item",theme);
        set({theme})
    },
}))
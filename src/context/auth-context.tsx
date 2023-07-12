import React from "react";


export const AuthContext = React.createContext({
    accessToken: "",
    trackData: [{}],
    isLoggedIn: false,
});


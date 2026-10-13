import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const getToken = async (username) => {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });
      const result = await response.json();
      console.debug(result);
      setLocation("TABLET");
      return result.token;
    } catch (e) {
      console.error(e);
    }
  };

  const signup = async (formData) => {
    const username = formData.get("name");
    const token = await getToken(username);
    setToken(token);
  };

  // TODO: authenticate
  const authenticate = async () => {
    if (!token) throw Error("No token provided");

    try {
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(!response.ok) throw Error("no token");
      setLocation("TUNNEL");

      /*const result = await response.json();
      const success = result.success;

      if (success) {
        setLocation("Tunnel");
      } else {
        throw Error("Failed to authenicate");
      }*/
    } catch (e) {
      console.error(e);
    }
  };

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}

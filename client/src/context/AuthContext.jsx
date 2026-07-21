import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await api.get("/users/profile");

        setUser({
          id: res.data._id,
          ...res.data,
        });
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      }
    }

    loadUser();
  }, []);

  const updateUser = (updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
      id: updates.id || prev.id,
    }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
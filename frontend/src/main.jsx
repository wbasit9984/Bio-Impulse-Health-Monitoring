import "./index.css";
import App from "./App.jsx";
import systemState from "../state/state";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SocketContextProvider } from "../context/socketContext.jsx";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storageType = typeof window !== "undefined" ? storage.default("local") : createNoopStorage();

const persistConfig = { key: "root", storage: storageType, version: 1 };
const persistedReducer = persistReducer(persistConfig, systemState);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistor = persistStore(store)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
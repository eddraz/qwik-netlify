import { db } from "~/core/firebase";
import { collection, getDocs } from "firebase/firestore";

import {
  component$,
  createContextId,
  type Signal,
  Slot,
  useContextProvider,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import {
  routeLoader$,
  server$,
  type RequestHandler,
} from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

export const useGetUsers = routeLoader$(async () => {
  try {
    const usersRef = collection(db, "users");
    const query = await getDocs(usersRef);

    return query.docs.map((doc) => ({
      id: doc.id,
      displayName: doc.data().displayName,
      email: doc.data().email,
    })) as {
      id: string;
      displayName: string;
      email: string;
    }[];
  } catch (error) {
    console.log(">> error: ", error);
  }

  return [];
});

export const UserAuthenticatedContext =
  createContextId<Signal<string>>("user-authenticated");

export const handleCookies = server$(function (token?: string) {
  const userSession = this.cookie.get("user-session")?.value;
  if (!userSession && token) {
    this.cookie.set("user-session", token, {
      path: "/",
      httpOnly: true,
    });
  }
  return userSession;
});
export const deleteCookie = server$(function (name: string) {
  this.cookie.delete(name);
});

export default component$(() => {
  const userAuthenticated = useSignal<string>();
  useContextProvider(UserAuthenticatedContext, userAuthenticated);

  useTask$(async ({ track }) => {
    track(() => userAuthenticated.value);

    userAuthenticated.value = (await handleCookies()) || "";
  });

  return <Slot />;
});

import { db } from "~/core/firebase";
import { doc, setDoc } from "firebase/firestore";

import {
  deleteCookie,
  handleCookies,
  useGetUsers,
  UserAuthenticatedContext,
} from "./layout";
import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  useNavigate,
  type DocumentHead,
} from "@builder.io/qwik-city";

export const useAddUser = routeAction$(async (data) => {
  try {
    console.log(data);
    await setDoc(doc(db, `users/${data.id}`), {
      id: data.id,
      displayName: data.displayName,
      email: data.email,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }

  return {
    success: false,
  };
});

export default component$(() => {
  const nav = useNavigate();
  const users = useGetUsers();
  const action = useAddUser();
  const userAuthenticated = useContext(UserAuthenticatedContext);
  const id = useSignal<string>(Date.now().toString());
  const nombre = useSignal<string>("");
  const email = useSignal<string>("");

  useTask$(({ track }) => {
    track(() => userAuthenticated.value);
  });

  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div>

      {action.value?.success && <>Good!</>}

      <Form action={action}>
        <input
          type="text"
          name="id"
          class="border-2"
          placeholder="id"
          bind:value={id}
        />
        <input
          type="text"
          name="displayName"
          class="border-2"
          placeholder="nombre"
          bind:value={nombre}
        />
        <input
          type="text"
          name="email"
          class="border-2"
          placeholder="email"
          bind:value={email}
        />

        <button type="submit" class="mx-2 rounded-md bg-green-300">
          Submit!
        </button>
      </Form>

      <hr />

      {userAuthenticated.value ? (
        <button
          class="mx-2 rounded-md bg-red-300"
          onClick$={async () => {
            try {
              await deleteCookie("user-session");
              userAuthenticated.value = "";
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Cerrar Sesión
        </button>
      ) : (
        <>
          {users.value.map((user) => (
            <div key={user.id} class="my-2">
              {user.email}{" "}
              <button
                class="mx-2 rounded-md bg-blue-300"
                onClick$={async () => {
                  try {
                    await deleteCookie("user-session");

                    const delay = setTimeout(async () => {
                      await handleCookies(user.id);

                      clearTimeout(delay);
                      nav("/middleroute/");
                    }, 500);

                    userAuthenticated.value = user.id;
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          ))}
        </>
      )}

      <hr />

      <a href="/middleroute/">Middle route</a>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};

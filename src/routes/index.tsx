import { component$ } from "@builder.io/qwik";
import { server$, type DocumentHead } from "@builder.io/qwik-city";

export const setCookieServer = server$(async function () {
  console.log("setCookieServer");
  this.cookie.set("test", "test", { path: "/", httpOnly: true });
});

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div>

      <button
        onClick$={() => {
          console.log("clicked");
          setCookieServer();
        }}
      >
        Set cookie
      </button>
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

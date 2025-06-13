import { addCharacter } from "./lib/db";

function App() {
  return (
    <main className="">
      <h1>Welcome to Tauri + Preact</h1>

      <form
        className=""
        // onSubmit={(e) => {
        //   e.preventDefault();
        // }}
      >
        <input
          id="greet-input"
          // onInput={(e) => console.log(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="button" onClick={async () => await addCharacter()}>
          Add
        </button>
      </form>
    </main>
  );
}

export default App;

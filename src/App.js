import { useState } from "react";
import Main from "./components/Main";
import { langContext } from "./Contexts/langContext.jsx";


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);


  return (
    <langContext.Provider value={{isDarkMode, setIsDarkMode}}>
      <Main/>
    </langContext.Provider>
  );
}

export default App;

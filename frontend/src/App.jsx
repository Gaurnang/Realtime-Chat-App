import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

function App() {
  const [myName, setMyName] = useState("Gaurang");

  return (

    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatPage myName={myName} />} />
          <Route path="/login" element={<LoginPage myName={myName} />} />
          <Route path="/signup" element={<SignupPage myName={myName} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
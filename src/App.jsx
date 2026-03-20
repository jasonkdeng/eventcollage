import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MosaicPage from "./pages/MosaicPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mosaic/:id" element={<MosaicPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

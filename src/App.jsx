import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GetUser from "./pages/GetUser";
import Navbar from "./components/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GetUser />,
  },
]);

function App() {
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

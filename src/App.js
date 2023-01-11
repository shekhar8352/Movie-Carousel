import "./App.css";
import Navbar from "./Components/Navbar";
import Banner from "./Components/Banner";
import Movies from "./Components/Movies";
import Favourite from "./Components/favourite";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/favourites" element={<Favourite/>} />
      </Routes>
      {/* <Banner/> */}
      {/* <Movies/> name="udai" */}
      {/* <Favourite/> */}
    </Router>
  );
}

export default App;


function Home(props) {
  return (
    <>
      <Banner {...props} />
      <Movies {...props} />
    </>
  );
}

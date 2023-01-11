import './App.css';
import Navbar from './Components/Navbar';
import Banner from './Components/Banner';
import Movies from './Components/Movies';
import Favourite from './Components/favourite';
import {BrowserRouter as Router,Switch,Route, BrowserRouter} from 'react-router-dom';
import { Routes ,Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
    <Navbar/>
    <Routes>
      <Route path='/' exact render={(props)=>(
        <>
          <Banner {...props}/>
          <Movies {...props}/>
        </>
      )}/>
      <Route path='/favourites' component={Favourite} />
    </Routes>
    {/* <Banner/> */}
    {/* <Movies/> name="udai" */}
    {/* <Favourite/> */}
  </Router>
  );
}

export default App;

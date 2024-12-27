import "./App.css";
import CitySearch from "./features/components/CitySearch";
import CardLine from "./features/components/card_line/CardLine";
import MainCard from "./features/components/main_card/MainCard";
import NavBar from "./features/components/nav_bar/NavBar";

function App() {
  return (
    <div className="App">
      <NavBar />
      {/* <CitySearch /> */}
      <MainCard />
      <CardLine />
    </div>
  );
}

export default App;

//i will need a 5 days forward cast in every card elemant//

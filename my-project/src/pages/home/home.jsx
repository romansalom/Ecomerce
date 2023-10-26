
import Navbar from "../../componentes/Navbar/navBar"
import Header from "../../componentes/Header/header"
import Cards from "../../componentes/Cards/cards";
function Home() {

  
    return (
        <div>
        <Navbar />
      {/* Agrega un espacio vertical de 1rem */}
        <Header />
     
        <Cards></Cards> {/* Agrega un espacio vertical de 1rem */}
      </div>
    );
  }
  
  export default Home;
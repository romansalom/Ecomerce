
import Navbar from "../../componentes/Navbar/navBar"
import Header from "../../componentes/Header/header"
function Home() {

  
    return (
        <div>
        <Navbar />
        <div className="h-4"></div> {/* Agrega un espacio vertical de 1rem */}
        <Header />
      </div>
    );
  }
  
  export default Home;
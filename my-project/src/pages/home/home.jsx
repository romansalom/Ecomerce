import Navbars from '../../componentes/Navbar/navBar';
import Header from '../../componentes/Header/header';
import Cards from '../../componentes/Cards/cards';
import './home.css';

function Home() {
  return (
    <div className="contenedor-zoom">
      <Navbars />
      <Header />
      <br />
      <Cards />
    </div>
  );
}

export default Home;

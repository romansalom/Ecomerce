import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Header() {
  const settings = {
    dots: false, // Desactiva los botones de navegación
    infinite: true,
    speed: 5000, // Cambia la velocidad a 5 segundos
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Cambia el tiempo de transición a 5 segundos
  };

  return (
    <header>
      <Slider {...settings}>
        <div>
          <div className="flex items-center justify-center w-full h-full bg-white">
            <img
              src="imagen1.jpg"
              alt="Imagen 1"
              className="max-w-full max-h-full"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center w-full h-full bg-white">
            <img
              src="imagen1.jpg"
              alt="Imagen 2"
              className="max-w-full max-h-full"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center w-full h-full bg-white">
            <img
              src="imagen1.jpg"
              alt="Imagen 3"
              className="max-w-full max-h-full"
            />
          </div>
        </div>
        {/* Agrega más imágenes según sea necesario */}
      </Slider>
    </header>
  );
}

export default Header;

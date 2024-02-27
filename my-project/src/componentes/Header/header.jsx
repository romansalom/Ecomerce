import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Header() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <header className=" relative overflow-hidden">
      <Slider {...settings}>
        <div>
          <div className="w-full h-full">
            <img
              src="bannenuevo.jpg"
              alt="Imagen 1"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="w-full h-full">
            <img
              src="aaaaa3.jpg"
              alt="Imagen 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="w-full h-full">
            <img
              src="FRUITIAxFumevapebanner_1024x1024.jpg"
              alt="Imagen 3"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Slider>
    </header>
  );
}

export default Header;

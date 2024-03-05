import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Image } from '@nextui-org/react';

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
            <Image
              src="bannenuevo.jpg"
              alt="NextUI hero Image with delay"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="w-full h-full">
            <Image
              src="aaaaa3.jpg"
              alt="NextUI hero Image with delay"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="w-full h-full">
            <Image
              src="FRUITIAxFumevapebanner_1024x1024.jpg"
              alt="NextUI hero Image with delay"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Slider>
    </header>
  );
}

export default Header;

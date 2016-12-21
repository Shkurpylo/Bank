import React, { Component } from 'react';
import Slider from 'react-slick';

export default class HomeCarousel extends Component {

  render() {
    const settings = {
      dots: true,
      fade: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      initialSlide: 0,
      autoplay: true,
      autoplaySpeed: 3000,
    };

    const styles = require('./HomeCarousel.scss');

    return (
      <div>
        <h2> This awesome bank will help you to:</h2>
        <Slider {...settings}>
          <div className={styles.pages}>
          <h3>pay</h3>
            <div className={styles.imgTwo}> </div>
          </div>
                    <div className={styles.pages}>
          <h3>manage your card</h3>
            <div className={styles.imgFour}> </div>
          </div>
          <div className={styles.pages}>
          <h3>observe your activity</h3>
            <div className={styles.imgThree}> </div>
          </div>
                    <div className={styles.pages}>
          <h3>receive money</h3>
            <div className={styles.imgOne}> </div>
          </div>

        </Slider>
      </div>
    );
  }
}

import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { FaArrowRight } from "react-icons/fa6"

import type { Swiper as SwiperType } from "swiper"

import "./Slider.scss"
import "swiper/scss"

const Slider = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="sliderBlock" id="feedback">
      <div className="sliderBlock__header">
        <h1>Отзывы</h1>
        <div className="slider-btn">
          <button onClick={() => swiperRef.current?.slidePrev()} className="btn btn_prev">
            <FaArrowRight size={ 32 }/>
          </button>
          <button onClick={() => swiperRef.current?.slideNext()} className="btn btn_next">
            <FaArrowRight size={ 32 }/>
          </button>
        </div>
      </div>
      <Swiper
        spaceBetween={40}
        slidesPerView={3}
        modules={[Navigation]}
        navigation={{
          prevEl: ".btn_prev",
          nextEl: ".btn_next",
        }}
        onSwiper={(swiper: SwiperType) => {
          swiperRef.current = swiper;
        }}
      >
        <SwiperSlide>
          <img src="" alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="" alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="" alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="" alt="" />
        </SwiperSlide>
      </Swiper>
    </section>
  )
}

export default Slider

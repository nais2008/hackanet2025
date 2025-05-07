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
          <h1>Загрузка</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus quo excepturi earum modi reiciendis ad maiores laborum nihil tempora eius, ullam quod est molestiae tenetur. Cum quaerat adipisci hic numquam!</p>
        </SwiperSlide>
        <SwiperSlide>
        <h1>Загрузка</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae aperiam sunt maxime dolor eos, unde asperiores enim assumenda delectus voluptas necessitatibus nostrum ullam ad earum quis, perspiciatis quibusdam voluptate modi.</p>
        </SwiperSlide>
        <SwiperSlide>
          <h1>Загрузка</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dignissimos molestiae, inventore doloribus accusantium ut nihil molestias impedit quaerat vitae quas corporis iusto, aperiam provident voluptates, laboriosam architecto dicta neque.</p>
        </SwiperSlide>
        <SwiperSlide>
          <h1>Загрузка</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore, aliquid eaque unde ut deleniti officia dolore laborum nihil doloribus consequatur odit ullam adipisci vitae fuga quo ea quos quia culpa.</p>
        </SwiperSlide>
      </Swiper>
    </section>
  )
}

export default Slider

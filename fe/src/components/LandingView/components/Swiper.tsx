import { Button, Carousel } from "antd";

import className from "../index.module.less";

export default function LandingSwiper() {
  return (
    <div className={className["landing-swiper"]}>
      <Carousel autoplay>
        <div
          className={`${className["landing-swiper-item"]} ${className["landing-swiper-item-01"]}`}
        >
          <h2>CV Builder工单系统即将上线</h2>
          <p>智能的工单系统，敬请期待！</p>
          <Button type="primary">立即体验</Button>
        </div>
      </Carousel>
    </div>
  );
}

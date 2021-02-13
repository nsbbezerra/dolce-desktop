import React, { memo } from "react";
import Lottie from "react-lottie";

function LottieComponent({ animation, width, height }) {
  const authAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Lottie
      options={authAnimationOptions}
      height={height}
      width={width}
      isClickToPauseDisabled={true}
    />
  );
}

export default memo(LottieComponent);

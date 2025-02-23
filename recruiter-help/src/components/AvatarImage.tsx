import React from "react";

function AvatarImage({ src }: { src: string }) {
  return <img className="aspect-square h-full w-full" src={src} />;
}

export default AvatarImage;

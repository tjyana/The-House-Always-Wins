import React from "react";

function CardTitle({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname: string;
}) {
  return <h3 className={classname}>{children}</h3>;
}

export default CardTitle;

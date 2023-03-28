import React from "react";
import type { FC, ReactElement, ReactNode } from "react";
import { container } from "./layout.css";

const Layout: FC<{ children: ReactNode }> = ({ children }): ReactElement => {
  return <div className={container}>{children}</div>;
};

export default Layout;

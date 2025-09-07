import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const WidgetFrame: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="rounded-xl shadow-md bg-white p-2 h-full w-full">
      <h3 className="text-sm font-bold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default WidgetFrame;

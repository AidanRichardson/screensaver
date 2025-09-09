import React from "react";

interface Props {
  editing: boolean;
  children: React.ReactNode;
}

const WidgetFrame: React.FC<Props> = ({ editing, children }) => {
  const base = "w-full h-full flex items-center justify-center";

  if (editing) {
    return (
      <div
        className={`${base} rounded-xl shadow-md p-2 bg-black/30 text-center border border-amber-50`}
      >
        {children}
      </div>
    );
  }

  return <div className={base}>{children}</div>;
};

export default WidgetFrame;

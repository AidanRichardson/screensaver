import React from "react";

interface Props {
  editing: boolean;
  children: React.ReactNode;
}

const WidgetFrame: React.FC<Props> = ({ editing, children }) => {
  if (editing) {
    return (
      <div className="rounded-xl shadow-md p-2 h-full w-full text-center border border-amber-50">
        <div>{children}</div>
      </div>
    );
  }
  return (
    <div className="text-center">
      <div>{children}</div>
    </div>
  );
};

export default WidgetFrame;

import React from "react";

interface NuggetProps {
  tagItem: string;
}

const Nugget: React.FC<NuggetProps> = ({ tagItem }) => {
  return (
    <div className="bg-primary-xBackgroundCard px-3 py-0.5 text-sm rounded-xl">
      {tagItem}
    </div>
  );
};

export default Nugget;

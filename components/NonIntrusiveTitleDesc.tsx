import React from "react";

interface NonIntrusiveTitleDescProps {
  title: string;
  description: string;
  icon?: React.ReactNode; // Optional icon
}

const NonIntrusiveTitleDesc: React.FC<NonIntrusiveTitleDescProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center text-center mt-5 mb-8">
      {/* Title */}
      <div className="flex items-center justify-center space-x-2 mb-4">
        {icon && <div className="text-primary-dark text-2xl">{icon}</div>}
        <h2 className="text-3xl font-semibold text-primary-dark">{title}</h2>
      </div>

      {/* Description */}
      <p className="text-lg text-white">{description}</p>
    </div>
  );
};

export default NonIntrusiveTitleDesc;

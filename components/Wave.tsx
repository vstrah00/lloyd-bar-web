"use client"; // Add this if you're using Next.js and need client-side functionality

const Wave = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden">
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[150%] h-[120px]"
        preserveAspectRatio="none"
      >
        {/* Layer 1 - Base Wave */}
        <path
          fill="#0077BE"
          fillOpacity="0.8"
          d="M0,96L48,90C96,85,192,75,288,69C384,64,480,64,576,74.7C672,85,768,107,864,112C960,117,1056,107,1152,96C1248,85,1344,75,1392,69L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          className="animate-wave-1"
        ></path>

        {/* Layer 2 - Overlay Wave */}
        <path
          fill="#0077BE"
          fillOpacity="0.6"
          d="M0,96L48,85C96,75,192,53,288,48C384,43,480,53,576,64C672,75,768,85,864,85C960,85,1056,75,1152,69C1248,64,1344,75,1392,80L1440,85L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          className="animate-wave-2"
        ></path>

        {/* Layer 3 - Top Wave */}
        <path
          fill="#FFFFFF"
          fillOpacity="0.4"
          d="M0,96L48,90C96,85,192,75,288,69C384,64,480,64,576,74.7C672,85,768,107,864,112C960,117,1056,107,1152,96C1248,85,1344,75,1392,69L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          className="animate-wave-3"
        ></path>
      </svg>
    </div>
  );
};

export default Wave;
import "../Matchmaker.css";

export default function GradientText({
  children,
  className = "",
  colors = ["rgba(253, 202, 0, 1)", "rgba(151, 121, 0, 1)", "rgba(253, 202, 0, 1)", "rgba(151, 121, 0, 1)","rgba(253, 202, 0, 1)"], 
  animationSpeed = 8, // Default animation speed in seconds
  showBorder = false, // Default overlay visibility
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className={`animated-gradient-text ${className}`}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
      <div className="gold-colour-text-content" style={gradientStyle}>{children}</div>
    </div>
  );
}

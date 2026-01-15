const levels = ["Bad", "Good", "Great", "Excellent"];

const PowerMeter = ({ power }) => {
  return (
    <div className="p-4 border border-blue-500 rounded-xl">
      <h3 className="font-bold mb-2">Eleven Power</h3>

      {levels.map((level, index) => (
        <div
          key={level}
          className={`text-sm ${
            power >= index ? "text-blue-400" : "text-gray-600"
          }`}
        >
          {level}
        </div>
      ))}
    </div>
  );
};

export default PowerMeter;

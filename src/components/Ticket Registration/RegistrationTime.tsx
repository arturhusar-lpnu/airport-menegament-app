import { useEffect, useState } from "react";

interface Props {
  onStart: () => void;
  onStop: () => void;
  onExpire: () => void;
  isRegistrationActive: boolean;
  setIsRegistrationActive: (active: boolean) => void;
}

const RegistrationTimer = ({
  onStart,
  onStop,
  onExpire,
  isRegistrationActive,
  setIsRegistrationActive,
}: Props) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    const endTime = localStorage.getItem("registrationEndTime");
    if (endTime) {
      const diff = Math.floor(
        (new Date(endTime).getTime() - Date.now()) / 1000
      );
      if (diff > 0) {
        setRemainingTime(diff);
        setIsRegistrationActive(true);
      } else {
        localStorage.removeItem("registrationEndTime");
      }
    }
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!isRegistrationActive || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRegistrationActive, remainingTime]);

  const handleStart = () => {
    const endTime = new Date(Date.now() + 15 * 60 * 1000);
    localStorage.setItem("registrationEndTime", endTime.toISOString());
    setRemainingTime(15 * 60);
    setIsRegistrationActive(true);
    onStart();
  };

  const handleStop = () => {
    localStorage.removeItem("registrationEndTime");
    setRemainingTime(0);
    setIsRegistrationActive(false);
    onStop();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center gap-4">
      {!isRegistrationActive ? (
        <button
          onClick={handleStart}
          className="rounded-md bg-transparent text-xl text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2"
        >
          Start Registration
        </button>
      ) : (
        <>
          <span className="text-lg font-medium text-green-700">
            Registration Active: {formatTime(remainingTime)}
          </span>
          <button
            onClick={handleStop}
            className="rounded-md bg-red-100 text-red-600 hover:bg-red-500 hover:text-white px-4 py-2"
          >
            Stop Registration
          </button>
        </>
      )}
    </div>
  );
};

export default RegistrationTimer;

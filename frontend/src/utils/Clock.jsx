import React, { useEffect, useState } from "react";

function Clock() {
  const [clockState, setClockState] = useState();

  useEffect(() => {
    setInterval(() => {
      const date = new Date();
      setClockState(date.toLocaleTimeString('es-MX'));
    }, 0);
  }, []);

  return(
    <div className="text-center">
      <h1 className="text-8xl font-semibold text-gray-900">{clockState}</h1>
    </div>
  );
}

export default Clock;
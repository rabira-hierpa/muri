import { useEffect, useState } from "react";
export const usePopulationPrediction = (
  population: number,
  growthRate: number,
  years: number
) => {
  const [populationPrediction, setPopulationPrediction] = useState<number[]>(
    []
  );
  const [calculationRunning, setCalculationRunning] = useState<boolean>(false);

  useEffect(() => {
    setCalculationRunning(true);

    const worker = new Worker(
      new URL(
        "../utils/workers/populationPrediction.worker.ts",
        import.meta.url
      )
    );
    worker.postMessage({ population, growthRate, years });
    worker.onmessage = (event) => {
      console.log("Worker data", event.data);
      setPopulationPrediction(event.data);
      setCalculationRunning(false);
    };

    return () => {
      setCalculationRunning(false);
      worker.terminate();
    };
  }, [growthRate, population, years]);

  return [calculationRunning, populationPrediction] as const;
};

export default usePopulationPrediction;

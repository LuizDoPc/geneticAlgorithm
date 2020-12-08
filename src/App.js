import { useState, useEffect, useCallback, useMemo } from 'react';
import Chart from 'react-apexcharts';

import algoritmoGenetico from './AG';

const App = () => {
  const getAptidao = (individuo) => {
    return individuo ** 2 - 3 * individuo + 4;
  };

  const [generations, setGenerations] = useState([]);
  const [currentGeneration, setCurrentGeneration] = useState(0);

  const getX = useCallback(
    () => new Array(21).fill().map((_, index) => index - 10),
    [],
  );

  const dots = useMemo(
    () =>
      generations[currentGeneration]?.map((item) => ({
        x: item,
        y: getAptidao(item),
      })),
    [generations, currentGeneration],
  );

  const line = useMemo(
    () =>
      getX()?.map((item) => ({
        x: item,
        y: getAptidao(item),
      })),
    [getX],
  );

  const [data, setData] = useState({
    options: {
      xaxis: {
        type: 'numeric',
        min: -10,
        max: 10,
        tickAmount: 10,
      },
      chart: {
        height: 350,
        type: 'line',
      },
      fill: {
        type: 'solid',
      },
      markers: {
        size: [1, 6],
      },
      tooltip: {
        shared: false,
        intersect: true,
      },
      legend: {
        show: false,
      },
    },
    series: [
      {
        name: 'function',
        type: 'line',
        data: [],
      },
      {
        name: 'generations',
        type: 'line',
        data: [],
      },
    ],
  });

  useEffect(() => {
    setData((oldData) => ({
      ...oldData,
      series: [
        {
          name: 'function',
          type: 'line',
          data: line,
        },
        {
          name: 'generations',
          type: 'scatter',
          data: dots,
        },
      ],
    }));
  }, [line, dots]);

  useEffect(() => {
    const newGenerations = algoritmoGenetico();
    setGenerations(newGenerations);
  }, []);

  return (
    <div
      style={{
        padding: '20px',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '30px',
        }}>
        <button
          onClick={() => {
            if (currentGeneration > 0) setCurrentGeneration((old) => old - 1);
          }}>
          Geração Anterior
        </button>
        {`Geração ${currentGeneration}`}
        <button
          onClick={() => {
            if (currentGeneration < generations.length - 1)
              setCurrentGeneration((old) => old + 1);
          }}>
          Próxima Geração
        </button>
      </div>
      <Chart
        options={data.options}
        series={data.series}
        type="line"
        width="500"
      />
    </div>
  );
};

export default App;

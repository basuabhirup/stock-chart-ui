import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { ApexOptions } from "apexcharts";

const StockChart = () => {
  const [series, setSeries] = useState<
    ApexAxisChartSeries | ApexNonAxisChartSeries | undefined
  >();

  const [options] = useState<ApexOptions>({
    chart: {
      type: "candlestick",
      height: 450,
    },
    title: {
      text: "AAPL Intraday Stock Data",
      align: "center",
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  });

  const fetchData = async () => {
    const symbol = "AAPL";
    const interval = "15min";
    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }?function=TIME_SERIES_DAILY&symbol=${symbol}&interval=${interval}&apikey=${
      import.meta.env.VITE_API_KEY
    }`;

    try {
      const response = await axios.get(url);
      const data = response.data["Time Series (Daily)"];

      const seriesData = Object.keys(data).map((time) => ({
        x: new Date(time),
        y: [
          parseFloat(data[time]["1. open"]),
          parseFloat(data[time]["2. high"]),
          parseFloat(data[time]["3. low"]),
          parseFloat(data[time]["4. close"]),
        ],
      }));

      setSeries([{ data: seriesData }]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="lg:max-w-4xl mx-auto mt-10 p-4 bg-slate-700 text-blue-900 shadow-md rounded-lg border h-[600px]">
      {!!series && (
        <>
          <h1 className="text-xl font-bold mb-4">{options.title?.text}</h1>
          <ReactApexChart
            options={options}
            series={series}
            type="candlestick"
            height={450}
          />
        </>
      )}
    </div>
  );
};

export default StockChart;

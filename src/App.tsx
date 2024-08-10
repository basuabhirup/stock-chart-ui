import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { ApexOptions } from "apexcharts";
import { Option, Select, Spinner, Typography } from "@material-tailwind/react";
import { IDataResolutions, IParams } from "./utils/interfaces";

const dataResolutions: IDataResolutions = {
  daily: {
    function: "TIME_SERIES_DAILY",
    objName: "Time Series (Daily)",
  },
  weekly: {
    function: "TIME_SERIES_WEEKLY",
    objName: "Weekly Time Series",
  },
  monthly: {
    function: "TIME_SERIES_MONTHLY",
    objName: "Monthly Time Series",
  },
  intraday: {
    function: "TIME_SERIES_INTRADAY",
    interval: "5min",
    objName: `Time Series (5min)`,
  },
};

const StockChart = () => {
  const [series, setSeries] = useState<
    ApexAxisChartSeries | ApexNonAxisChartSeries | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [params, setParams] = useState<IParams>({
    symbol: "IBM",
    resolution: "daily",
    function: "TIME_SERIES_DAILY",
    objName: dataResolutions["daily"].objName,
    interval: undefined,
  });

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "candlestick",
      height: 450,
    },
    title: {
      text: `${params.symbol} ${
        params.resolution[0].toUpperCase() + params.resolution.slice(1)
      } Stock Data`,
      align: "left",
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
    const func = params.function;
    const symbol = params.symbol;
    const interval = params.interval;
    const objName = params.objName;
    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }?function=${func}&symbol=${symbol}&interval=${interval}&apikey=${
      import.meta.env.VITE_API_KEY
    }`;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(url);
      const data = response.data[objName];

      if (!data) {
        throw new Error(response.data.Information);
      }

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
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message) {
        setErrorMessage(error.message);
      }
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleResolutionChange = (val: string) => {
    if (
      val !== "daily" &&
      val !== "weekly" &&
      val !== "monthly" &&
      val !== "intraday"
    ) {
      return;
    }
    setParams((prev) => ({
      ...prev,
      resolution: val,
      function: dataResolutions[val].function,
      objName: dataResolutions[val].objName,
      interval: val === "intraday" ? dataResolutions[val].interval : undefined,
    }));
  };

  const handleIntervalChange = (val: string) => {
    if (
      val !== "1min" &&
      val !== "5min" &&
      val !== "15min" &&
      val !== "30min" &&
      val !== "60min"
    ) {
      return;
    }
    setParams((prev) => ({
      ...prev,
      interval: val,
      objName: `Time Series (${val})`,
    }));
  };

  useEffect(() => {
    fetchData();
    setOptions((prevValue) => ({
      ...prevValue,
      title: {
        ...prevValue.title,
        text: `${params.symbol} ${
          params.resolution[0].toUpperCase() + params.resolution.slice(1)
        } Stock Data`,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="lg:max-w-4xl w-[90vw] mx-auto mt-10 p-4 bg-slate-100 text-blue-950 shadow-md rounded-lg border h-[660px]">
      <div className="flex gap-4 mb-8">
        <div className="w-48">
          <Select
            color="blue"
            label="Select Temporal Resolution"
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 },
            }}
            placeholder={"Daily"}
            value={params.resolution}
            onChange={(val) => handleResolutionChange(val as string)}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {["daily", "weekly", "monthly", "intraday"].map((resolution) => (
              <Option key={resolution} value={resolution}>
                {resolution[0].toUpperCase() + resolution.slice(1)}
              </Option>
            ))}
          </Select>
        </div>

        {params.resolution === "intraday" && (
          <div className="w-48">
            <Select
              color="blue"
              label="Select Interval"
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
              placeholder="5min"
              value={params.interval}
              onChange={(val) => handleIntervalChange(val as string)}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {["1min", "5min", "15min", "30min", "60min"].map((interval) => (
                <Option key={interval} value={interval}>
                  {interval}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </div>
      {(!series || isLoading || errorMessage.length > 0) && (
        <div className="flex flex-col justify-center items-center gap-y-2 h-[450px]">
          {isLoading && (
            <Spinner
              className="h-16 w-16 text-gray-900/50"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          )}
          {errorMessage.length > 0 && !isLoading && (
            <Typography
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              className="mx-12 font-extralight leading-relaxed"
              variant="small"
              color="gray"
            >
              {errorMessage}
            </Typography>
          )}
        </div>
      )}

      {!!series && !isLoading && errorMessage.length === 0 && (
        <>
          {/* <h1 className="text-xl font-bold mb-4">{options.title?.text}</h1> */}
          <ReactApexChart
            options={options}
            series={series}
            type="candlestick"
            height={550}
          />
        </>
      )}
    </div>
  );
};

export default StockChart;

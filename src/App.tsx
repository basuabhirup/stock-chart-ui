import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { ApexOptions } from "apexcharts";
import {
  Button,
  Card,
  IconButton,
  Input,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { IDataResolutions, IParams } from "./utils/interfaces";

const DEBOUNCE_DELAY = 300;

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDark, setIsDark] = useState<boolean>(false);

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
        formatter: (value) => new Date(value).toLocaleDateString(),
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    theme: {
      mode: "light",
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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as string;
    setSearchTerm(value);
  };

  const handleSearch = async () => {
    try {
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${
        import.meta.env.VITE_API_KEY
      }`;

      const response = await axios.get(url);
      const results = response.data?.bestMatches || [];

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching symbols:", error);
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    setParams((prev) => ({
      ...prev,
      symbol,
    }));
    setSearchTerm("");
    setSearchResults([]);
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

  const toggleDarkTheme = () => {
    setIsDark((prev) => !prev);
    document.body.classList.toggle("dark");
  };

  useEffect(() => {
    if (!searchTerm) return;

    const debounceTimer = setTimeout(async () => {
      handleSearch();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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
      xaxis: {
        ...prevValue.xaxis,
        tooltip: {
          ...prevValue.xaxis?.tooltip,
          formatter: (value) =>
            params.resolution === "intraday"
              ? new Date(value).toLocaleString("en-GB")
              : new Date(value).toLocaleDateString(),
        },
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      theme: {
        ...prevOptions.theme,
        mode: isDark ? "dark" : "light",
      },
    }));
  }, [isDark]);

  return (
    <div className="lg:max-w-6xl w-[90vw] mx-auto mt-10 p-4 bg-slate-100 text-blue-950 shadow-md rounded-lg border min-h-[660px] dark:bg-gray-800">
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="w-full md:max-w-48 mr-2">
          <div className="relative flex w-full gap-2 md:w-max">
            <Input
              type="search"
              color={isDark ? "white" : "blue"}
              label="Search Company"
              value={searchTerm}
              onChange={handleSearchInput}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <IconButton
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              color={isDark ? "black" : "white"}
              className="!absolute right-1 top-1 rounded"
              size="sm"
            >
              <i className="fas fa-search" />
            </IconButton>
          </div>

          {searchResults.length > 0 && (
            <Card
              className="absolute z-50 mt-2 max-h-60 overflow-y-auto border rounded"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <ul>
                {searchResults.map((result) => (
                  <li
                    key={result["1. symbol"]}
                    onClick={() => handleSymbolSelect(result["1. symbol"])}
                    className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                  >
                    {result["2. name"]} ({result["1. symbol"]})
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

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
            className="dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700"
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
              className="dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700"
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
        <div className="w-12 ml-auto">
          <Button
            onClick={toggleDarkTheme}
            className="h-8 w-8 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            size="sm"
          >
            <svg
              className="fill-violet-700 block dark:hidden"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
            <svg
              className="fill-yellow-500 hidden dark:block"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
      </div>
      {(!series || isLoading || errorMessage.length > 0) && (
        <div className="flex flex-col justify-center items-center gap-y-2 h-[450px]">
          {isLoading && (
            <Spinner
              className="h-16 w-16 text-gray-900/50"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              color={isDark ? "blue" : "gray"}
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

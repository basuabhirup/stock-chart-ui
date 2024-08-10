import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { IDataResolutions, IParams, IStockContext } from "../utils/interfaces";
import { ApexOptions } from "apexcharts";

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

const defaultParams = {
  symbol: "IBM",
  resolution: "daily" as IParams["resolution"],
  function: "TIME_SERIES_DAILY" as IParams["function"],
  objName: dataResolutions["daily"].objName,
  interval: undefined,
};

const defaultStockContext = {
  series: undefined,
  isLoading: false,
  errorMessage: "",
  isDark: false,
  options: {},
  params: defaultParams,
  handleSymbolSelect: () => {},
  handleResolutionChange: () => {},
  handleIntervalChange: () => {},
  toggleDarkTheme: () => {},
};

// Create the StockContext
const StockContext = createContext<IStockContext>(defaultStockContext);

// Create the StockProvider component
export const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const [series, setSeries] = useState<
    ApexAxisChartSeries | ApexNonAxisChartSeries | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(false);

  const [params, setParams] = useState<IParams>(defaultParams);

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

  const handleSymbolSelect = (symbol: string) => {
    setParams((prev) => ({
      ...prev,
      symbol,
    }));
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
    <StockContext.Provider
      value={{
        series,
        isLoading,
        errorMessage,
        isDark,
        options,
        params,
        handleSymbolSelect,
        handleResolutionChange,
        handleIntervalChange,
        toggleDarkTheme,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export default StockContext;

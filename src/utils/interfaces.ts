import { ApexOptions } from "apexcharts";

export interface IDataResolutions {
  daily: {
    function: "TIME_SERIES_DAILY";
    objName: string;
  };
  weekly: {
    function: "TIME_SERIES_WEEKLY";
    objName: string;
  };
  monthly: {
    function: "TIME_SERIES_MONTHLY";
    objName: string;
  };
  intraday: {
    function: "TIME_SERIES_INTRADAY";
    interval: "1min" | "5min" | "15min" | "30min" | "60min";
    objName: string;
  };
}

export interface IParams {
  resolution: "daily" | "weekly" | "monthly" | "intraday";
  function:
    | "TIME_SERIES_DAILY"
    | "TIME_SERIES_WEEKLY"
    | "TIME_SERIES_MONTHLY"
    | "TIME_SERIES_INTRADAY";
  symbol: string;
  objName: string;
  interval?: "1min" | "5min" | "15min" | "30min" | "60min";
}

export interface IStockContext {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  isLoading: boolean;
  errorMessage: string;
  isDark: boolean;
  options: ApexOptions;
  params: IParams;
  handleSymbolSelect: (symbol: string) => void;
  handleResolutionChange: (val: string) => void;
  handleIntervalChange: (val: string) => void;
  toggleDarkTheme: () => void;
}

export interface ISymbolSearch {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
}

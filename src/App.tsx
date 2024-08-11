import { useContext } from "react";
import ThemeToggleButton from "./components/ThemeToggleButton";
import DropdownSelector from "./components/DropDownSelector";
import StockSearch from "./components/StockSearch";
import StockChart from "./components/StockChart";
import StockContext from "./context/StockContext";

const App = () => {
  const {
    params,
    handleResolutionChange,
    handleIntervalChange,
    toggleDarkTheme,
  } = useContext(StockContext);

  return (
    <div className="lg:max-w-4xl w-[90vw] mx-auto mt-10 p-4 bg-slate-100 text-blue-950 shadow-md rounded-lg border min-h-[660px] bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="w-full md:max-w-48 mr-2">
          <StockSearch />
        </div>

        <div className="w-48">
          <DropdownSelector
            label="Select Temporal Resolution"
            options={["daily", "weekly", "monthly", "intraday"]}
            value={params.resolution}
            onChange={(val) => handleResolutionChange(val as string)}
          />
        </div>

        {params.resolution === "intraday" && (
          <div className="w-48">
            <DropdownSelector
              label="Select Interval"
              options={["1min", "5min", "15min", "30min", "60min"]}
              value={params.interval as string}
              onChange={(val) => handleIntervalChange(val as string)}
            />
          </div>
        )}
        <div className="w-12 ml-auto">
          <ThemeToggleButton toggleDarkTheme={toggleDarkTheme} />
        </div>
      </div>
      <StockChart />
    </div>
  );
};

export default App;

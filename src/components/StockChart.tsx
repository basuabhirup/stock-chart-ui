import { Spinner, Typography } from "@material-tailwind/react";
import { useContext } from "react";
import ReactApexChart from "react-apexcharts";
import StockContext from "../context/StockContext";

const StockChart: React.FC = () => {
  const { series, options, isLoading, errorMessage, isDark } =
    useContext(StockContext);

  return (
    <>
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
              color={isDark ? "white" : "gray"}
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
    </>
  );
};

export default StockChart;

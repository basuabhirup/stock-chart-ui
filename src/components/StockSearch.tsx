import { Card, IconButton, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface IProps {
  isDark: boolean;
  handleSymbolSelect: (symbol: string) => void;
}

const DEBOUNCE_DELAY = 300;

const StockSearch: React.FC<IProps> = ({ isDark, handleSymbolSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelect = (result: any) => {
    handleSymbolSelect(result["1. symbol"]);
    setSearchTerm("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (!searchTerm) return;

    const debounceTimer = setTimeout(async () => {
      handleSearch();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <>
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
                onClick={() => onSelect(result)}
                className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700"
              >
                {result["2. name"]} ({result["1. symbol"]})
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
};

export default StockSearch;

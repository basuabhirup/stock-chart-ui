import { Option, Select } from "@material-tailwind/react";

interface IProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string | undefined) => void;
}

const DropdownSelector: React.FC<IProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <Select
      color="blue"
      label={label}
      animate={{
        mount: { y: 0 },
        unmount: { y: 25 },
      }}
      placeholder={"Daily"}
      value={value}
      onChange={onChange}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      className="dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700"
    >
      {options.map((option) => (
        <Option key={option} value={option}>
          {Number.isNaN(Number(option[0]))
            ? option[0].toUpperCase() + option.slice(1)
            : option}
        </Option>
      ))}
    </Select>
  );
};

export default DropdownSelector;

import { useState } from "react";
import {
  CustomSelectProps,
  SelectOption,
} from "../../app/types/select";

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<SelectOption | null>(null);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className='custom-select'>
      <div className='select-trigger' onClick={toggleOpen}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div className='select-options'>
          {options.map((option) => (
            <div
              key={option.value}
              className='select-option'
              onClick={() => handleSelect(option)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

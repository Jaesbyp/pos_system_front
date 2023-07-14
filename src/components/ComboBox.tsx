interface IComboOptions {
  label: string;
  options: string[];
  onChange: (selectedValue: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  initialValue?: string;
}

const ComboBox = ({
  label = "",
  options = [],
  onChange = () => { },
  defaultValue = "",
  disabled = false,
  initialValue,
}: IComboOptions): JSX.Element => {
  const OpcionesCombo = options.map((opcion, index) => (
    <option value={opcion} key={index} disabled={disabled} >
      {opcion}
    </option>
  ));

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
  };

  return (
    <div className="w-full">
      <select
        className="border border-solid border-gray-600  py-2 px-4 bg-jair-black  rounded-md w-full "
        onChange={handleOnChange}
        defaultValue={initialValue ? initialValue : ""}
      >
        {defaultValue && <option value="">{defaultValue}</option>}
        {OpcionesCombo}
      </select>
    </div>
  );
};

export default ComboBox;

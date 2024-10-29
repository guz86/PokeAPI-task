interface TypeSelectProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  types: { name: string; url: string }[];
}

const TypeSelect: React.FC<TypeSelectProps> = ({
  selectedType,
  setSelectedType,
  types,
}) => {
  return (
    <select
      className='p-2 mb-4 text-black border border-gray-300 rounded-md'
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
    >
      <option value='all'>All</option>
      {types.map((type) => (
        <option key={type.name} value={type.name}>
          {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default TypeSelect;

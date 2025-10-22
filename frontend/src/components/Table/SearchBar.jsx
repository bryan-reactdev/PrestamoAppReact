export default function SearchBar({placeholder, globalFilter, setGlobalFilter}) {
  return (
    <div className="input-container">
      <i className="fas fa-search"></i>
      <input 
        type="text" 
        placeholder={placeholder}
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  )
}

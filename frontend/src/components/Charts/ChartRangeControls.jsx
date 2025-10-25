import React from 'react';

export default function ChartRangeControls({ 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange, 
  onReset 
}) {
  return (
    <div className="range-controls">
      <div className="range-input">
        <label htmlFor="min-value">Valor Mínimo</label>
        <input
          id="min-value"
          type="number"
          value={minValue}
          onChange={(e) => onMinChange(Number(e.target.value))}
          min="0"
          step="100"
        />
      </div>
      
      <div className="range-input">
        <label htmlFor="max-value">Valor Máximo</label>
        <input
          id="max-value"
          type="number"
          value={maxValue}
          onChange={(e) => onMaxChange(Number(e.target.value))}
          min="0"
          step="100"
        />
      </div>
      
      <button 
        className="btn btn-secondary"
        onClick={onReset}
      >
        Resetear
      </button>
    </div>
  );
}

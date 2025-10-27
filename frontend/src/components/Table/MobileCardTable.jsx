import { flexRender } from '@tanstack/react-table'
import React from 'react'

/**
 * Mobile Card Table Component
 * 
 * This component renders TanStack Table data as mobile-friendly cards instead of traditional table rows.
 * It follows TanStack Table's headless approach by reusing the same table instance and data processing.
 * 
 * Key Features:
 * - Reuses existing table instance and column definitions
 * - Maintains all TanStack Table functionality (sorting, filtering, pagination)
 * - Responsive card layout optimized for mobile screens
 * - Preserves all cell renderers and custom formatting
 * - Supports row selection and action buttons
 * 
 * Card Layout:
 * - Header: First 2 columns (primary information)
 * - Body: Middle columns (secondary information)  
 * - Footer: Last column (actions, if present)
 * 
 * @param {Object} table - TanStack Table instance
 * @param {Array} columns - Column definitions (same as desktop table)
 * @param {Array} centered - Array of column IDs that should be centered
 * @param {Function} onRowSelect - Optional row selection handler
 * @param {string} selectedRowId - Currently selected row ID
 * @param {boolean} loading - Loading state
 * @param {Array} data - Table data
 */
export default function MobileCardTable({
  table,
  columns,
  centered = [],
  onRowSelect,
  selectedRowId,
  loading,
  data
}) {
  // Get the rows from the table instance
  const rows = table.getRowModel().rows;

  // If loading, show loading card
  if (loading) {
    return (
      <div className="mobile-cards-container">
        <div className="mobile-card loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="mobile-cards-container">
        <div className="mobile-card empty">
          <h3>ESTA SECCIÓN ESTÁ VACÍA.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-cards-container">
      {rows.map((row) => (
        <div
          key={row.id}
          className={`mobile-card ${row.id === selectedRowId ? 'selected' : ''}`}
          onClick={() => onRowSelect?.(row.original)}
          style={{ cursor: onRowSelect ? 'pointer' : 'default' }}
        >
          {/* Card Layout: Top Left (Usuario + Info) | Top Right (Money + Estado) */}
          <div className="mobile-card-main">
            {/* Left Side - Usuario and Info */}
            <div className="mobile-card-left">
              {/* Usuario at top left */}
              {(() => {
                const usuarioColumn = columns.find(col => col.accessorKey === 'usuario');
                if (!usuarioColumn) return null;
                const cell = row.getVisibleCells().find(cell => cell.column.id === 'usuario');
                if (!cell) return null;
                
                return (
                  <div className="mobile-card-usuario">
                    {flexRender(usuarioColumn.cell || cell.column.columnDef.cell, cell.getContext())}
                  </div>
                );
              })()}

              {/* Additional info under usuario */}
              <div className="mobile-card-info">
                {columns.filter(col => 
                  !['usuario', 'accion'].includes(col.accessorKey) && 
                  !col.accessorKey.includes('Monto') && 
                  !col.accessorKey.includes('Total') &&
                  !col.accessorKey.includes('Mora') &&
                  !col.accessorKey.includes('Abono') &&
                  !col.accessorKey.includes('estado') &&
                  !col.accessorKey.includes('Estado')
                ).map((column) => {
                  const cell = row.getVisibleCells().find(cell => cell.column.id === column.accessorKey);
                  if (!cell) return null;
                  
                  return (
                    <div key={column.accessorKey} className="mobile-card-info-item">
                      <span className="mobile-card-info-label">{column.header}:</span>
                      <span className={`mobile-card-info-value ${centered.includes(column.accessorKey) ? 'centered' : ''}`}>
                        {flexRender(column.cell || cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Money and Estado */}
            <div className="mobile-card-right">
              {/* Money amounts at top right */}
              <div className="mobile-card-money">
                {columns.filter(col => 
                  col.accessorKey.includes('Monto') || 
                  col.accessorKey.includes('Total') ||
                  col.accessorKey.includes('Mora') ||
                  col.accessorKey.includes('Abono')
                ).map((column) => {
                  const cell = row.getVisibleCells().find(cell => cell.column.id === column.accessorKey);
                  if (!cell) return null;
                  
                  return (
                    <div key={column.accessorKey} className="mobile-card-money-item">
                      <span className="mobile-card-money-label">{column.header}:</span>
                      <span className={`mobile-card-money-value ${centered.includes(column.accessorKey) ? 'centered' : ''}`}>
                        {flexRender(column.cell || cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Estado under money */}
              {(() => {
                const estadoColumn = columns.find(col => 
                  col.accessorKey.includes('estado') || 
                  col.accessorKey.includes('Estado') ||
                  col.accessorKey.includes('calificacion')
                );
                if (!estadoColumn) return null;
                const cell = row.getVisibleCells().find(cell => cell.column.id === estadoColumn.accessorKey);
                if (!cell) return null;
                
                return (
                  <div className="mobile-card-estado">
                    <span className="mobile-card-estado-label">{estadoColumn.header}:</span>
                    <span className={`mobile-card-estado-value ${centered.includes(estadoColumn.accessorKey) ? 'centered' : ''}`}>
                      {flexRender(estadoColumn.cell || cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Card Footer - Actions */}
          {columns[columns.length - 1]?.accessorKey === 'accion' && (
            <div className="mobile-card-footer">
              {(() => {
                const actionCell = row.getVisibleCells().find(cell => cell.column.id === 'accion');
                if (!actionCell) return null;
                
                return (
                  <div className="mobile-card-actions">
                    {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

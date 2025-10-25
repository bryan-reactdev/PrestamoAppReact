import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar';
import Tabs from './Tabs';
import { useSearchParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import TabsTotals from './TabsTotals';
 
export default function BaseTable({
  searchBarPlaceholder = !isMobile ? 'Buscar en tabla...' : 'Buscar...', 
  tabs = [], 
  data, 
  columns,
  card,
  centered, 
  flexable, 
  loading, 
  customHeaderHeight, 
  children,
  currentTab,
  onTabChange,
  isCardTabs,
  hideSearchbar,
  hidePagination,
    selectedRowId,
    onRowSelect,

}) {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab');

    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: !isMobile ? 8 : 6,
    });

    const globalFilterFn = (row, columnId, filterValue) => {
        const searchableString = row.getValue(columnId);
        
        // If no filter value, include the row
        if (!filterValue || filterValue === '') {
            return true;
        }

        const cellValue = String(searchableString).toLowerCase();
        const filterVal = filterValue.toLowerCase();

        // 1. First try exact match (respects original formatting)
        if (cellValue.includes(filterVal)) {
            return true;
        }

        // 2. Handle currency formatting: remove commas for matching
        // This allows "7357.00" to match "7,357.00" and vice versa
        const cellWithoutCommas = cellValue.replace(/,/g, '');
        const filterWithoutCommas = filterVal.replace(/,/g, '');
        
        if (cellWithoutCommas.includes(filterWithoutCommas)) {
            return true;
        }

        return false;
    };

    useEffect(() => {
        if (initialTab) {
            const matchedTab = tabs.find(tab => tab.label === initialTab);
            if (matchedTab) {
                onTabChange(matchedTab.label);
            }
        }
        else if (initialTab === null || initialTab === ''){
            const hasTabs = tabs.length > 0;

            if (hasTabs) {
                onTabChange(tabs[0].label);
            }
        }
    }, [initialTab]);

    const activeTab = tabs.find(tab => tab.label === currentTab) || {};
    
    // --- Inicialiazación de la tabla ---
    const table = useReactTable({
        data: activeTab.data ?? data,
        columns: activeTab.columnDefinitions ?? columns, 
        card: activeTab.card ?? card,
        state: {
            pagination,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: globalFilterFn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getRowId: originalRow => originalRow.id
    })

    return (
        <>
        {!hideSearchbar &&
            <div className="search-tabs-container">
                {children}

                <SearchBar placeholder={searchBarPlaceholder} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}/>

                {tabs.length > 0 &&
                    isCardTabs
                    ?
                    <TabsTotals
                        tabs={tabs}
                        currentTab={currentTab} 
                        setCurrentTab={(tab) => onTabChange(tab.label)} 
                    />
                    :
                    <Tabs 
                        tabs={tabs}
                        currentTab={currentTab} 
                        setCurrentTab={(tab) => onTabChange(tab.label)} 
                    />
                }
            </div>
        }

        {isMobile 
        ?
        <div className="cards-container">
            {table.getRowModel().rows.map((row) =>(
                React.createElement(activeTab.card ?? card, {row, key: row.id})
            ))}

            {/* --- Estado de carga durante fetch --- */}
            {loading && (
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <div className="spinner"></div>
                </div>
            )}

            {/* --- Estado vacío --- */}
            {!loading && (activeTab?.data?.length <= 0 || !activeTab?.data && data?.length <= 0) && (
                <div style={{width: '100%', textAlign: 'center'}}>
                    <h3>ESTA SECCIÓN ESTÁ VACÍA.</h3>
                </div>
            )}

            {/* Controles de navgeación */}
            <div className="pagination">
                <button
                    className='btn-navigation'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                    &laquo; ANTERIOR
                </button>

                <span>
                    {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </span>
                
                <button
                    className='btn-navigation'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    >
                    SIGUIENTE &raquo;
                </button>
            </div>
        </div>
        :
        <div className="table" style={{width: '100%'}}>
            {table.getHeaderGroups().map((headerGroup) =>(
                <div className="tr header" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <div 
                            className={`th ${centered.includes(header.column.id) ? 'column-centered' : ''}`}
                            style={{
                            ...(flexable.includes(header.column.id)
                                ? { flex: 1 }
                                : { width: header.getSize() }),
                            ...(customHeaderHeight ? { minHeight: customHeaderHeight } : {})
                            }}
                            key={header.id}
                        >
                            {header.column.columnDef.header}
                            {header.column.getCanSort() && (
                                <i
                                    className={
                                    header.column.getIsSorted() === "asc"
                                        ? "fas fa-sort-up"
                                        : header.column.getIsSorted() === "desc"
                                        ? "fas fa-sort-down"
                                        : "fas fa-sort"
                                    }
                                    onClick={header.column.getToggleSortingHandler()}
                                ></i>
                            )}

                        </div>
                    ))}
                </div>
            ))}

            {table.getRowModel().rows.map((row) =>(
                <div
                    className={`tr ${row.id === selectedRowId ? 'selected-row' : ''}`}
                    key={row.id}
                    onClick={() => onRowSelect?.(row.original)}
                    style={{ cursor: onRowSelect ? 'pointer' : 'default' }}
                >
                    {row.getVisibleCells().map((cell) =>(
                        <div 
                            className={`td ${centered.includes(cell.column.id) ? 'column-centered' : ''}`}
                            style={flexable.includes(cell.column.id) 
                                ? {flex: 1} 
                                : {width: cell.column.getSize()}} key={cell.id}
                        >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    ))}
                </div>
            ))}

            {/* --- Estado de carga durante fetch --- */}
            {loading && (
                <div className="tr">
                    <div className="td" style={{width: table.getTotalSize(), justifyContent: 'center', height: 100, flex: 1}}>
                        <div className="spinner"></div>
                    </div>
                </div>
            )}

            {/* --- Estado vacío --- */}
            {!loading && (activeTab?.data?.length <= 0 || !activeTab?.data && data?.length <= 0) && (
                <div className="tr">
                    <div className="td" style={{width: table.getTotalSize(), justifyContent: 'center', flex: 1}}>
                        <h3>ESTA SECCIÓN ESTÁ VACÍA.</h3>
                    </div>
                </div>
            )}

            {!hidePagination &&
            <div className="pagination">
                <button
                    className='btn-navigation'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                    &laquo; ANTERIOR
                </button>

                <span>
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </span>
                
                <button
                    className='btn-navigation'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    >
                    SIGUIENTE &raquo;
                </button>
            </div>
            }
        </div>      
        }

        </>
    )
}

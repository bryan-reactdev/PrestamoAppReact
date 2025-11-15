import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar';
import Tabs from './Tabs';
import { useSearchParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import TabsTotals from './TabsTotals';
import BasePagination from '../../base/BasePagination';
 
export default function BaseTable({
  searchBarPlaceholder = !isMobile ? 'Buscar en tabla...' : 'Buscar...', 
  tabs = [], 
  data, 
  columns,
  card,
  cardProps = {},
  centered, 
  flexable, 
  loading, 
  customHeaderHeight, 
  children,
  currentTab,
  onTabChange,
  isCardTabs,
  showTabsAtTop = false,
  hideSearch,
  hideSearchbar,
  hidePagination,
    selectedRowId,
    onRowSelect,
  pageSize = !isMobile ? 8 : 6,
}) {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab');

    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize,
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

    useEffect(() => {
        setPagination({
            pageIndex: 0,
            pageSize: pageSize
        });
    }, [pageSize]);

    const activeTab = tabs.find(tab => tab.label === currentTab) || {};
    const activeColumns = activeTab.columnDefinitions ?? columns;
    const activeData = activeTab.data ?? data;

    // --- Inicialiazación de la tabla ---
    const table = useReactTable({
        data: activeData,
        columns: activeColumns, 
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
        {showTabsAtTop && 
            tabs.length > 0 && (
                isCardTabs
                ?
                <TabsTotals
                    className="mb-4"
                    tabs={tabs}
                    currentTab={currentTab} 
                    setCurrentTab={(tab) => onTabChange(tab.label)} 
                />
                :
                <Tabs
                    className="mb-4" 
                    tabs={tabs}
                    currentTab={currentTab} 
                    setCurrentTab={(tab) => onTabChange(tab.label)} 
                />
            )
        }

        {!hideSearchbar &&
            <div className="search-tabs-container">
                {children}

                {!hideSearch &&
                    <SearchBar placeholder={searchBarPlaceholder} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}/>
                }

                {!showTabsAtTop && tabs.length > 0 && (
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
                )}
            </div>
        }

        {isMobile 
        ?
        <div className="cards-container">
            {table.getRowModel().rows.map((row) =>(
                React.createElement(activeTab.card ?? card, {
                    row, 
                    key: row.id, 
                    selectedRowId,
                    onRowSelect,
                    ...cardProps
                })
            ))}

            {/* --- Estado de carga durante fetch --- */}
            {loading && (
                <div style={{maxWidth: '100%', display: 'flex', justifyContent: 'center'}}>
                    <div className="spinner"></div>
                </div>
            )}

            {/* --- Estado vacío --- */}
            {!loading && (activeTab?.data?.length <= 0 || !activeTab?.data && data?.length <= 0) && (
                <div style={{width: '100%', textAlign: 'center'}}>
                    <h3>ESTA SECCIÓN ESTÁ VACÍA.</h3>
                </div>
            )}

            <BasePagination table={table} hidePagination={hidePagination} />
        </div>
        :
        <div>
            <div className="table" style={{maxWidth: '100%', overflowX: 'auto'}} key={`table-${currentTab}-${activeColumns?.length || 0}`}>
                {table.getHeaderGroups().map((headerGroup) =>(
                    <div className="tr header" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            const columnSize = header.column.getSize();
                            const isFlexable = typeof flexable === 'string' 
                                ? flexable === header.column.id 
                                : Array.isArray(flexable) && flexable.includes(header.column.id);
                            
                            return (
                            <div 
                                className={`th ${centered.includes(header.column.id) ? 'column-centered' : ''}`}
                                style={{
                                ...(isFlexable
                                    ? { flex: 1 }
                                    : { width: columnSize, minWidth: columnSize, maxWidth: columnSize }),
                                ...(customHeaderHeight ? { minHeight: customHeaderHeight } : {})
                                }}
                                key={header.id}
                            >
                                <span>{header.column.columnDef.header}</span>
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
                        )})}
                    </div>
                ))}

                {table.getRowModel().rows.map((row) =>(
                    <div
                        className={`tr ${row.id === selectedRowId ? 'selected-row' : ''}`}
                        key={row.id}
                        onClick={() => onRowSelect?.(row.original)}
                        style={{ cursor: onRowSelect ? 'pointer' : 'default' }}
                    >
                        {row.getVisibleCells().map((cell) => {
                            const columnSize = cell.column.getSize();
                            const isFlexable = typeof flexable === 'string' 
                                ? flexable === cell.column.id 
                                : Array.isArray(flexable) && flexable.includes(cell.column.id);
                            
                            return (
                            <div 
                                className={`td ${centered.includes(cell.column.id) ? 'column-centered' : ''} p-1 py-2`}
                                style={isFlexable 
                                    ? {flex: 1} 
                                    : {width: columnSize, minWidth: columnSize, maxWidth: columnSize}} 
                                key={cell.id}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                        )})}
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

            </div>      
            <BasePagination table={table} hidePagination={hidePagination} />
        </div>
        }

        </>
    )
}

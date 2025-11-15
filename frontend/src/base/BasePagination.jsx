import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isMobile } from 'react-device-detect';

const BasePagination = ({ table, hidePagination }) => {
    if (hidePagination) return null;

    if (isMobile) {
        return (
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
        );
    }

    return (
        <div className="pagination">
            <Button className="btn-glass" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft/>
                ANTERIOR
            </Button>
            
            <span className="text-primary">
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            
            <Button className="btn-glass" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                SIGUIENTE
                <ChevronRight/>
            </Button>
        </div>
    );
};

export default BasePagination;


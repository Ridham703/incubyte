import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ page, totalPages, totalItems, limit, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination Navigation" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-800">{startItem}</span> to{' '}
        <span className="font-bold text-slate-800">{endItem}</span> of{' '}
        <span className="font-bold text-slate-800">{totalItems}</span> vehicles
      </div>

      <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] min-w-[40px] flex items-center justify-center font-bold"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            aria-label={`Go to page ${num}`}
            aria-current={num === page ? 'page' : undefined}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border min-h-[40px] min-w-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              num === page
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] min-w-[40px] flex items-center justify-center font-bold"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;

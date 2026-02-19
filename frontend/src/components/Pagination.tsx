interface PaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({ page, totalPages, onPrevious, onNext }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-700 bg-space-800 px-4 py-3">
      <button
        onClick={onPrevious}
        disabled={page <= 1}
        className="rounded-md border border-slate-600 px-3 py-1 text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm text-slate-300">
        Pagina {page} de {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-md border border-slate-600 px-3 py-1 text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proxima
      </button>
    </div>
  );
}

import { useState, useMemo, useCallback } from 'react';
import type { Claim } from '@/types';
import { getClaimAmount } from '@/utils/dataLoader';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

interface Props {
  claims: Claim[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

type SortKey =
  | 'PolicyNumber'
  | 'Age'
  | 'Sex'
  | 'AccidentArea'
  | 'Fault'
  | 'VehiclePrice'
  | 'Make'
  | 'VehicleCategory'
  | 'claimAmount'
  | 'fraudLabel'
  | 'Month';

type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

export function ClaimsTable({ claims, searchTerm, onSearchChange }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('PolicyNumber');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const rows = [...claims];
    rows.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === 'claimAmount') {
        av = getClaimAmount(a);
        bv = getClaimAmount(b);
      } else {
        av = a[sortKey] as string | number;
        bv = b[sortKey] as string | number;
      }
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const as = String(av ?? '');
      const bs = String(bv ?? '');
      return sortDir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return rows;
  }, [claims, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const pageRows = sorted.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
      setPage(0);
    },
    [sortKey]
  );

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-slate-400" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="ml-1 inline h-3.5 w-3.5 text-slate-700" />
    ) : (
      <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-slate-700" />
    );
  };

  const thClass =
    'px-3 py-2 text-left text-xs font-semibold text-slate-600 cursor-pointer select-none hover:bg-slate-100 whitespace-nowrap';
  const tdClass = 'px-3 py-2 text-sm text-slate-700 whitespace-nowrap';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">High-Risk Claims Table</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {sorted.length.toLocaleString()} claims matching current filters
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setPage(0);
            }}
            placeholder="Search claims..."
            className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-sm text-slate-800 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className={thClass} onClick={() => toggleSort('PolicyNumber')}>
                Policy #<SortIcon col="PolicyNumber" />
              </th>
              <th className={thClass} onClick={() => toggleSort('Age')}>
                Age<SortIcon col="Age" />
              </th>
              <th className={thClass} onClick={() => toggleSort('Sex')}>
                Gender<SortIcon col="Sex" />
              </th>
              <th className={thClass} onClick={() => toggleSort('Month')}>
                Month<SortIcon col="Month" />
              </th>
              <th className={thClass} onClick={() => toggleSort('AccidentArea')}>
                Area<SortIcon col="AccidentArea" />
              </th>
              <th className={thClass} onClick={() => toggleSort('Fault')}>
                Fault<SortIcon col="Fault" />
              </th>
              <th className={thClass} onClick={() => toggleSort('Make')}>
                Make<SortIcon col="Make" />
              </th>
              <th className={thClass} onClick={() => toggleSort('VehicleCategory')}>
                Category<SortIcon col="VehicleCategory" />
              </th>
              <th className={thClass} onClick={() => toggleSort('VehiclePrice')}>
                Vehicle Price<SortIcon col="VehiclePrice" />
              </th>
              <th
                className={thClass}
                onClick={() => toggleSort('claimAmount')}
                style={{ textAlign: 'right' }}
              >
                Est. Claim<SortIcon col="claimAmount" />
              </th>
              <th className={thClass} onClick={() => toggleSort('fraudLabel')}>
                Status<SortIcon col="fraudLabel" />
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-sm text-slate-400">
                  No claims match the current filters.
                </td>
              </tr>
            ) : (
              pageRows.map((c) => (
                <tr
                  key={c.PolicyNumber}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className={tdClass}>{c.PolicyNumber}</td>
                  <td className={tdClass}>{c.Age}</td>
                  <td className={tdClass}>{c.Sex}</td>
                  <td className={tdClass}>{c.Month}</td>
                  <td className={tdClass}>{c.AccidentArea}</td>
                  <td className={tdClass}>{c.Fault}</td>
                  <td className={tdClass}>{c.Make}</td>
                  <td className={tdClass}>{c.VehicleCategory}</td>
                  <td className={tdClass}>{c.VehiclePrice}</td>
                  <td className={`${tdClass} text-right font-medium`}>
                    ${getClaimAmount(c).toLocaleString()}
                  </td>
                  <td className={tdClass}>
                    {c.isFraud ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Fraud
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Genuine
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Breadcrumb from '../../../../components/vendor/Breadcrumbs/Breadcrumb';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import VendorRootState from '../../../../redux/rootstate/VendorState';
import { getDate, bulkBlockDates } from '../../../../config/services/venderApi';
import { toast } from 'react-toastify';
import Layout from '../../../../layout/vendor/Layout';
import { CalendarDaysIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CustomDatePicker: React.FC = () => {
  const vendor = useSelector((state: VendorRootState) => state.vendor.vendordata);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getDate(vendor?.id, { withCredentials: true })
      .then((res) => setBookedDates(res.data.bookedDates))
      .catch(console.error);
  }, []);

  // Helpers

  const toDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isBooked = (date: Date) =>
    bookedDates.some((ds) => {
      const [y, m, d] = ds.split('-');
      return sameDay(date, new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
    });

  const isSelected = (date: Date) => selectedDates.some((sd) => sameDay(sd, date));

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    if (isBooked(date)) return;
    setSelectedDates((prev) =>
      isSelected(date)
        ? prev.filter((d) => !sameDay(d, date))
        : [...prev, date]
    );
  };

  const removeSelected = (date: Date) =>
    setSelectedDates((prev) => prev.filter((d) => !sameDay(d, date)));

  const clearAll = () => setSelectedDates([]);

  const dayClassName = (date: Date): string => {
    if (isBooked(date)) return 'viao-booked-day';
    if (isSelected(date)) return 'viao-selected-day';
    return '';
  };

  const handleBlockDates = async () => {
    if (!vendor) {
      toast.error('Something went wrong. Please refresh.');
      return;
    }
    if (selectedDates.length === 0) {
      toast.warning('Select at least one date to block.');
      return;
    }
    setIsSubmitting(true);
    try {
      const dateStrings = selectedDates.map(toDateString);
      const response = await bulkBlockDates(vendor?.id, dateStrings);
      setBookedDates(response.data.bookedDates);
      setSelectedDates([]);
      toast.success(`${dateStrings.length} date${dateStrings.length > 1 ? 's' : ''} blocked!`);
    } catch {
      toast.error('Failed to block dates. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName="Manage Dates" folderName="Booking" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 pb-28 lg:pb-0">

        {/* ── Calendar ────────────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 rounded-xl">
                  <CalendarDaysIcon className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Date Availability</p>
                  <p className="text-xs text-gray-400">Tap dates to select, then press Block</p>
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-red-100 border border-red-300 inline-block" />
                  Blocked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-100 border-2 border-amber-400 inline-block" />
                  Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#ede9fe] border-2 border-[#5b21b6] inline-block" />
                  Today
                </span>
              </div>
            </div>

            {/* Calendar */}
            <div className="p-5 viao-cal">
              <DatePicker
                selected={null}
                onChange={handleDateClick}
                inline
                minDate={new Date()}
                dayClassName={dayClassName}
              />
            </div>
          </div>
        </div>

        {/* ── Right panel ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Selected to block */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LockClosedIcon className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-gray-900">Selected to Block</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedDates.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedDates.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {selectedDates.length}
                </span>
              </div>
            </div>

            <div className="p-4">
              {selectedDates.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Click available dates<br />in the calendar to select them
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto mb-3">
                  {selectedDates
                    .slice()
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
                        <span className="text-xs font-medium text-amber-800">{formatDate(date)}</span>
                        <button
                          onClick={() => removeSelected(date)}
                          className="text-amber-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {/* Block button — desktop (always visible in panel) */}
              <button
                onClick={handleBlockDates}
                disabled={isSubmitting}
                className={`hidden lg:flex w-full items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  selectedDates.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <LockClosedIcon className="h-4 w-4" />
                {isSubmitting
                  ? 'Blocking...'
                  : selectedDates.length === 0
                  ? 'Select dates on the calendar'
                  : `Block ${selectedDates.length} Date${selectedDates.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>

          {/* Currently blocked dates list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Blocked Dates</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500">
                {bookedDates.length}
              </span>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              {bookedDates.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No dates blocked yet</p>
              ) : (
                <div className="space-y-1.5">
                  {bookedDates
                    .slice()
                    .sort()
                    .map((ds, i) => {
                      const [y, m, d] = ds.split('-');
                      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                      return (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          <span className="text-xs text-red-700 font-medium">{formatDate(date)}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile sticky bottom bar ─────────────────────────────────────────── */}
      {/* Always visible on mobile so user always knows how to submit */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          {selectedDates.length === 0 ? (
            <p className="text-xs text-gray-400">Tap dates on the calendar to select</p>
          ) : (
            <p className="text-xs text-gray-600 truncate">
              <span className="font-semibold text-amber-700">{selectedDates.length} date{selectedDates.length > 1 ? 's' : ''}</span> selected to block
            </p>
          )}
        </div>
        <button
          onClick={handleBlockDates}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
            selectedDates.length === 0 || isSubmitting
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md active:scale-95'
          }`}
        >
          <LockClosedIcon className="h-4 w-4" />
          {isSubmitting ? 'Blocking...' : 'Block Dates'}
        </button>
      </div>
    </Layout>
  );
};

export default CustomDatePicker;
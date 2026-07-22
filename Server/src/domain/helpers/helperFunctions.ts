import moment from 'moment-timezone';
import { Service } from '../entities/Service';

function toTitleCase(city: string): string {
  return city.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function getCurrentWeekRange () {
  return {
    startOfWeek: moment().tz("Asia/Kolkata").startOf("isoWeek").toDate(),
    endOfWeek: moment().tz("Asia/Kolkata").endOf("isoWeek").toDate()
  };
}

function getCurrentYearRange() {
  return {
    startOfYear: moment().tz("Asia/Kolkata").startOf("year").toDate(),
    endOfYear: moment().tz("Asia/Kolkata").endOf("year").toDate()
  };
}

function getLastFiveYearsRange() {
  const currentYear = moment().tz("Asia/Kolkata").year();
  return {
    startOfFiveYearsAgo: moment().tz("Asia/Kolkata").year(currentYear - 4).startOf("year").toDate(),
    endOfCurrentYear: moment().tz("Asia/Kolkata").endOf("year").toDate()
  };
}

export const calculateCancellationResult = (
  eventDateString: string,
  cancelledAt: Date,
  advancePaid: number,
  service: Service,
  adminCommissionPercent: number = 10
): {
  userRefund: number;
  adminKeeps: number;
  vendorCompensation: number;
  scenario: "full_refund" | "partial_refund" | "no_refund";
} => {
  // Calculate days between cancellation and event date
  const eventDate = new Date(eventDateString);
  eventDate.setHours(0, 0, 0, 0);
  const cancel = new Date(cancelledAt);
  cancel.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilEvent = Math.floor((eventDate.getTime() - cancel.getTime()) / msPerDay);

  // ── Scenario 1: Full refund window ──────────────────────────────────────────
  if (daysUntilEvent >= service.cancellationFullRefundBeforeDays) {
    return {
      userRefund: advancePaid,
      adminKeeps: 0,
      vendorCompensation: 0,
      scenario: "full_refund",
    };
  }

  // ── Scenario 2: Partial refund window ───────────────────────────────────────
  if (
    service.cancellationPartialRefundBeforeDays !== null &&
    service.partialRefundPercentage !== null &&
    daysUntilEvent >= service.cancellationPartialRefundBeforeDays
  ) {
    const userRefund = Math.round((advancePaid * service.partialRefundPercentage) / 100);
    const remaining = advancePaid - userRefund;
    const adminKeeps = Math.round((remaining * adminCommissionPercent) / 100);
    const vendorCompensation = remaining - adminKeeps;

    return {
      userRefund,
      adminKeeps,
      vendorCompensation,
      scenario: "partial_refund",
    };
  }

  // ── Scenario 3: No refund window ────────────────────────────────────────────
  const adminKeeps = Math.round((advancePaid * adminCommissionPercent) / 100);
  const vendorCompensation = advancePaid - adminKeeps;

  return {
    userRefund: 0,
    adminKeeps,
    vendorCompensation,
    scenario: "no_refund",
  };
};

export {
    toTitleCase,
    getCurrentWeekRange,
    getCurrentYearRange,
    getLastFiveYearsRange,
}
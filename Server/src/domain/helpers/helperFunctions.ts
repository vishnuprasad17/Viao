import moment from 'moment-timezone';

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

function calculateRefund(amount: number): number {
    if (amount <= 10000) {
      return amount - 500;
    } else if (amount <= 100000) {
      return amount - 1000;
    } else {
      return amount - 2000;
    }
  }

export {
    toTitleCase,
    getCurrentWeekRange,
    getCurrentYearRange,
    getLastFiveYearsRange,
    calculateRefund,
}
export interface ServiceValidationErrors {
  name: string;
  price: string;
  advancePercentage: string;
  minimumBookingNoticeInDays: string;
  cancellationFullRefundBeforeDays: string;
  cancellationPartialRefundBeforeDays: string;
  partialRefundPercentage: string;
}

export interface ServiceValidationValues {
  name: string;
  price: string;
  advancePercentage: string;
  minimumBookingNoticeInDays: string;
  cancellationFullRefundBeforeDays: string;
  cancellationPartialRefundBeforeDays: string;
  partialRefundPercentage: string;
}

export const validateService = (
  values: ServiceValidationValues,
): ServiceValidationErrors => {
  const errors: ServiceValidationErrors = {
    name: "",
    price: "",
    advancePercentage: "",
    minimumBookingNoticeInDays: "",
    cancellationFullRefundBeforeDays: "",
    cancellationPartialRefundBeforeDays: "",
    partialRefundPercentage: "",
  };

  // Name
  if (!values.name.trim()) {
    errors.name = "Service name is required";
  }

  // Price
  if (!values.price) {
    errors.price = "Valid price is required";
  } else {
    const price = Number(values.price);
    if (isNaN(price) || price <= 0) {
      errors.price = "Amount must be greater than 0";
    }
  }

  // Advance %
  const advance = Number(values.advancePercentage);
  if (isNaN(advance) || advance < 1 || advance > 100) {
    errors.advancePercentage = "Advance % must be between 1–100";
  }

  // Minimum Booking Notice
  if (!values.minimumBookingNoticeInDays.trim()) {
    errors.minimumBookingNoticeInDays = "Minimum notice is required";
  } else {
    const notice = Number(values.minimumBookingNoticeInDays);
    if (isNaN(notice) || notice < 0) {
      errors.minimumBookingNoticeInDays = "Minimum notice must be 0 or more";
    }
  }

  // Full Refund Days
  if (!values.cancellationFullRefundBeforeDays.trim()) {
    errors.cancellationFullRefundBeforeDays = "Full refund days is required";
  } else {
    const fullRefundDays = Number(values.cancellationFullRefundBeforeDays);
    if (isNaN(fullRefundDays) || fullRefundDays < 0) {
      errors.cancellationFullRefundBeforeDays =
        "Full refund days must be 0 or more";
    }
  }

  const fullRefundDays = Number(values.cancellationFullRefundBeforeDays);

  // Partial refund (optional but validated if filled)
  if (values.cancellationPartialRefundBeforeDays) {
    const partialDays = Number(values.cancellationPartialRefundBeforeDays);
    if (isNaN(partialDays) || partialDays < 0) {
      errors.cancellationPartialRefundBeforeDays =
        "Partial refund days must be 0 or more";
    } else if (partialDays >= fullRefundDays) {
      errors.cancellationPartialRefundBeforeDays =
        "Partial refund days must be less than full refund days";
    }
  }

  if (values.partialRefundPercentage) {
    const partialPercent = Number(values.partialRefundPercentage);
    if (isNaN(partialPercent) || partialPercent < 1 || partialPercent > 100) {
      errors.partialRefundPercentage = "Partial refund % must be 1–100";
    }
  }

  return errors;
};

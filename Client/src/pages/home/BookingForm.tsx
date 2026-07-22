import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import Select from "react-select";
import Footer from "../../layout/user/footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { validate } from "../../validations/home/BookingValidation";
import { bookEvent, getDate, getVendorServices } from "../../config/services/userApi";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserRootState from "../../redux/rootstate/UserState";
import { useSelector } from "react-redux";
import { Service } from "../../interfaces/commonTypes";
import PaymentModal from "../../components/user/profile/PaymentModal";

interface FormValues {
  serviceId: string;
  name: string;
  date: string;
  city: string;
  pin: string;
  mobile: string;
  userNote: string;
}

const initialValues: FormValues = {
  serviceId: "",
  name: "",
  date: "",
  city: "",
  pin: "",
  mobile: "",
  userNote: "",
};

interface SelectOption {
  value: string;
  label: string;
}

const BookingForm: React.FC = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const isLoggedIn = Boolean(user);
  const [minDate, setMinDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] =
    useState<Omit<FormValues, "userNote">>(initialValues);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [events, setEvents] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  const selectedService = events.find(
    (s) => s.id.toString() === formValues.serviceId,
  );
  const advanceAmount = selectedService
    ? Math.round(
        (selectedService.price * (selectedService.advancePercentage ?? 100)) /
          100,
      )
    : null;

  useEffect(() => {
    getDate(id as string, { withCredentials: true })
      .then((response) => {
        const dates = response.data.bookedDates.map((dateString: string) => {
          const [year, month, day] = dateString.split("-");
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        });
        setBookedDates(dates);
      })
      .catch(console.error);

    getVendorServices(id as string)
      .then((response) => setEvents(response.data.services))
      .catch(console.error);
  }, [id]);

  // Update minDate when service changes (based on minimumBookingNoticeInDays)
  useEffect(() => {
    if (selectedService?.minimumBookingNoticeInDays) {
      const date = new Date();
      date.setDate(date.getDate() + selectedService.minimumBookingNoticeInDays);
      date.setHours(0, 0, 0, 0);
      setMinDate(date);
    } else {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(0, 0, 0, 0);
      setMinDate(date);
    }
  }, [formValues.serviceId]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (name !== "userNote") {
      const errors = validate({ ...formValues, [name]: value });
      setFormErrors((prev) => ({ ...prev, ...errors }));
    }
  };

  const handleServiceChange = (value: string | undefined) => {
    const selectedValue = value || "";
    setFormValues({ ...formValues, serviceId: selectedValue });
    const errors = validate({ ...formValues, serviceId: selectedValue });
    setFormErrors((prev) => ({ ...prev, serviceId: errors.serviceId }));
  };

  const selectOptions: SelectOption[] = events.map((service) => ({
    value: service.id.toString(),
    label: `${service.name} - ₹${service.price.toLocaleString()} (Pay ₹${Math.round(
      (service.price * (service.advancePercentage ?? 100)) / 100,
    ).toLocaleString()} now)`,
  }));

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const adjustTimezone = (d: Date) => {
      const newDate = new Date(d);
      newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
      return newDate;
    };
    const adjustedDate = adjustTimezone(date);
    const dateString = adjustedDate.toISOString().split("T")[0];
    setFormValues((prev) => ({ ...prev, date: dateString }));
    setFormErrors((prev) => ({
      ...prev,
      date: validate({ ...formValues, date: dateString }).date,
    }));
  };

  const isDateBooked = (date: Date) =>
    bookedDates.some(
      (d) =>
        date.getFullYear() === d.getFullYear() &&
        date.getMonth() === d.getMonth() &&
        date.getDate() === d.getDate(),
    );

  const dayClassName = (date: Date) =>
    isDateBooked(date) ? "booked-date" : "";

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.values(errors).some((error) => error)) return;

    if (!isLoggedIn) {
      toast.error("Please log in to create a booking.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Step 1 — create booking, get bookingId back
      const response = await bookEvent(id, user?.id, formValues, {
        withCredentials: true,
      });
      const { bookingId } = response.data;

      setCreatedBookingId(bookingId);
      toast.success("Booking created! Choose your payment method below.");
      setPaymentModalOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Booking failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded px-6 pt-8 pb-8 w-full max-w-3xl mt-30 mb-30">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <Typography
                variant="h4"
                color="deep-purple"
                className="mb-6 text-center"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Event Booking
              </Typography>

              <form onSubmit={submitHandler} className="space-y-4">
                {/* Service */}
                <div>
                  <Select
                    options={selectOptions}
                    value={selectOptions.find(
                      (o) => o.value === formValues.serviceId,
                    )}
                    onChange={(opt) => handleServiceChange(opt?.value || "")}
                    placeholder="Select a service"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                  {formErrors.serviceId && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.serviceId}
                    </p>
                  )}

                  {/* Advance amount preview */}
                  {selectedService && advanceAmount !== null && (
                    <div className="mt-2 p-3 bg-deep-purple-50 rounded-lg border border-deep-purple-100">
                      <p className="text-sm text-deep-purple-700">
                        <span className="font-semibold">
                          Advance to pay now:
                        </span>{" "}
                        ₹{advanceAmount.toLocaleString()}
                        {selectedService.advancePercentage !== 100 && (
                          <span className="text-gray-500">
                            {" "}
                            ({selectedService.advancePercentage}% of ₹
                            {selectedService.price.toLocaleString()})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Full cancellation refund if cancelled{" "}
                        {selectedService.cancellationFullRefundBeforeDays}+ days
                        before event.
                      </p>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Date
                  </label>
                  <DatePicker
                    selected={
                      formValues.date ? new Date(formValues.date) : null
                    }
                    onChange={handleDateChange}
                    minDate={minDate}
                    filterDate={(date) => !isDateBooked(date)}
                    dayClassName={dayClassName}
                    placeholderText="Select available date"
                    className={`w-full p-3 border rounded-lg focus:ring-2 ${
                      formErrors.date
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-deep-purple-500 focus:ring-deep-purple-200"
                    }`}
                    dateFormat="MMMM d, yyyy"
                    showPopperArrow={false}
                    popperClassName="react-datepicker-popper"
                    wrapperClassName="w-full"
                    withPortal={window.innerWidth < 768}
                  />
                  {formErrors.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.date}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <Input
                    label="Name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    crossOrigin={undefined}
                    placeholder="Enter your name"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <Input
                    label="Place"
                    name="city"
                    value={formValues.city}
                    onChange={handleChange}
                    error={!!formErrors.city}
                    crossOrigin={undefined}
                    placeholder="Enter place name"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                {/* Pin */}
                <div>
                  <Input
                    label="Pin"
                    name="pin"
                    value={formValues.pin}
                    onChange={handleChange}
                    error={!!formErrors.pin}
                    crossOrigin={undefined}
                    placeholder="Enter pin"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  {formErrors.pin && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.pin}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <Input
                    label="Mobile"
                    name="mobile"
                    value={formValues.mobile}
                    onChange={handleChange}
                    error={!!formErrors.mobile}
                    crossOrigin={undefined}
                    placeholder="Enter your contact number"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  {formErrors.mobile && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.mobile}
                    </p>
                  )}
                </div>

                {/* User Note — optional */}
                <div>
                  <Textarea
                    label="Notes / Special Requests (optional)"
                    name="userNote"
                    value={formValues.userNote}
                    onChange={handleChange}
                    rows={3}
                    className="!border-gray-300"
                    placeholder="Any special requests or notes for the vendor..."
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                </div>

                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting || !isLoggedIn}
                  className="mt-6 bg-deep-purple-500 hover:bg-deep-purple-600 focus:ring-2 focus:ring-deep-purple-500 focus:ring-offset-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {!isLoggedIn ? "Login to book" : isSubmitting ? "Processing..." : "Book & Pay Now"}
                </Button>
              </form>

              <style>{`
                .react-datepicker { font-family: 'Inter', sans-serif; border: 1px solid #e5e7eb; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .react-datepicker__header { background-color: #f5f3ff; border-bottom: none; border-radius: 0.75rem 0.75rem 0 0; }
                .react-datepicker__day--selected { background-color: #6366f1; color: white; }
                .booked-date { background-color: #fecaca !important; color: #991b1b !important; position: relative; }
                .react-datepicker__day--disabled:not(.booked-date) { color: #d1d5db; background-color: #f9fafb; }
              `}</style>
            </div>

            <div className="hidden md:flex items-center justify-center p-6 bg-deep-purple-50">
              <img
                src="/imgs/booking/book-form.svg"
                alt="Booking illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal — opens after booking is created */}
      {createdBookingId && selectedService && advanceAmount !== null && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          bookingId={createdBookingId}
          vendorId={id ?? ""}
          vendorName={selectedService.name}
          vendorLogoUrl=""
          advanceAmount={advanceAmount}
          onSuccess={() => {
            setPaymentModalOpen(false);
            navigate(`/booking/confirmation?id=${createdBookingId}`);
          }}
        />
      )}

      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
};

export default BookingForm;
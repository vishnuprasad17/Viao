import React, { useEffect, useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import Select from "react-select";
import Footer from "../../layout/user/footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { validate } from "../../validations/home/BookingValidation";
import { bookEvent } from "../../config/services/userApi";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserRootState from "../../redux/rootstate/UserState";
import { useSelector } from "react-redux";
import { USER } from "../../config/routes/user.routes";
import { getDate, getServicesForPage } from "../../config/services/venderApi";
import { Service } from "../../interfaces/commonTypes";

interface FormValues {
  serviceId: string;
  name: string;
  date: string;
  city: string;
  pin: string;
  mobile: string;
}

const initialValues: FormValues = {
  serviceId: "",
  name: "",
  date: "",
  city: "",
  pin: "",
  mobile: "",
};

interface SelectOption {
  value: string;
  label: string;
}

const BookingForm: React.FC = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
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
  const [formErrors, setFormErrors] = useState<FormValues>(initialValues);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [events, setEvents] = useState<Service[]>([]);

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

    getServicesForPage(id as string)
      .then((response) => {
        setEvents(response.data.services);
        console.log(response);
      })
      .catch(console.error);
  }, [id]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const errors = validate({ ...formValues, [name]: value });
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };

  const handleServiceChange = (value: string | undefined) => {
    const selectedValue = value || "";
    setFormValues({ ...formValues, serviceId: selectedValue });
    const errors = validate({ ...formValues, serviceId: selectedValue });
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      serviceId: errors.serviceId,
    }));
  };

  const selectOptions: SelectOption[] = events.map((service) => ({
    value: service.id.toString(), // Ensure value is a string
    label: `${service.name} - ₹${service.price.toLocaleString()}`, // Display name and price
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

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate()
    );
  };

  const dayClassName = (date: Date) => {
    return isDateBooked(date) ? "booked-date" : "";
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.values(errors).some((error) => error)) return;

    try {
      const response = await bookEvent(id, user?.id, formValues, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      navigate(`${USER.PROFILE}${USER.BOOKING_DETAILS}`);
    } catch (error: any) {
      toast.error(error.response?.data.message || "Booking failed");
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

                {/* Other form fields */}
                <div>
                  <Select
                    options={selectOptions}
                    value={selectOptions.find(
                      (option) => option.value === formValues.serviceId
                    )}
                    onChange={(selectedOption) => {
                      handleServiceChange(selectedOption?.value || "");
                    }}
                    placeholder="Select a service"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                  {formErrors.serviceId && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.serviceId}
                    </p>
                  )}
                </div>
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

                <Button
                  type="submit"
                  fullWidth
                  className="mt-6 bg-deep-purple-500 hover:bg-deep-purple-600 focus:ring-2 focus:ring-deep-purple-500 focus:ring-offset-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Confirm Booking
                </Button>
              </form>
              <style>{`
        .react-datepicker {
          font-family: 'Inter', sans-serif;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .react-datepicker__header {
          background-color: #f5f3ff;
          border-bottom: none;
          border-radius: 0.75rem 0.75rem 0 0;
        }
        .react-datepicker__day--selected {
          background-color: #6366f1;
          color: white;
        }
        .booked-date {
          background-color: #fecaca !important;
          color: #991b1b !important;
          position: relative;
        }
        .booked-date::after {
          position: absolute;
          right: 2px;
          top: 0;
          font-size: 0.8em;
        }
        .react-datepicker__day--disabled:not(.booked-date) {
          color: #d1d5db;
          background-color: #f9fafb;
        }
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
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
};

export default BookingForm;
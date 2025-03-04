import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Breadcrumb from '../../../../components/vendor/Breadcrumbs/Breadcrumb';
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Select,
  Option,

} from '@material-tailwind/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import VendorRootState from '../../../../redux/rootstate/VendorState';
import { getDate, addDate } from '../../../../config/services/venderApi';
import { toast } from 'react-toastify';
import Layout from '../../../../layout/vendor/Layout';


const CustomDatePicker: React.FC = () => {
  const vendor = useSelector(
    (state: VendorRootState) => state.vendor.vendordata,
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>('');
  const [error, setError] = useState<string>('');
  const [selectError, setSelectError] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    getDate(vendor?.id, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setDates(response.data.bookedDates)
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedDate.length==0) {
      setError('Please select a date');
      return
    }
    if (selectedStatus?.length==0) {
      setSelectError('Please select status');
      return
    }

    addDate(
        { status: selectedStatus, date: selectedDate, vendorId: vendor?.id },
        { withCredentials: true },
      )
      .then((response) => {
        console.log(response.data);
        setDates(response.data.bookedDates)
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
      setSelectedDate('')
      setSelectedStatus('')
  };

  return (
    <Layout>
      <Breadcrumb pageName="Dates" folderName="Booking" />
      <div className="flex justify-between gap-2">
      <div className='w-full'>
      <Card
            className='p-10'
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography
                variant="h5"
                color="deep-purple"
                className="mb-5 text-center"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                This Month Event Plans
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="mb-2 text-center"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
               
                <i className="fas fa-circle" style={{ color: 'red' }}/>&nbsp;Booked Dates
               
              </Typography>
            <div className='flex justify-center'>
            
          <DatePicker
          className='mx-auto'
            selected={null}
            onChange={() => {}}
            inline
            minDate={new Date()}
            excludeDates={dates.map((date) => new Date(date))}
            dayClassName={(date) => {
              const utcDate = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
              );
              return dates?.includes(
                utcDate.toISOString().split('T')[0],
              )
                ? 'bg-red-500'
                : '';
            }}
          />
          </div>
          </Card>
        </div>
        <div>
          <Card
            className="w-96"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardBody
              className="flex flex-col gap-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="h5"
                color="deep-purple"
                className="mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Add Date
              </Typography>
              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  label="Date"
                  size="lg"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setError('');
                  }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
                {error ? <p className="text-red-400 text-sm">{error}</p> : ''}
                <Select
                  value={selectedStatus}
                  onChange={(e) => {
                    console.log(e);
                    setSelectedStatus(e);
                    setSelectError('');
                  }}
                  placeholder="Select status"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Option value="Available">Available</Option>
                  <Option value="Unavailable">Unavailable</Option>
                </Select>
                {selectError ? (
                  <p className="text-red-400 text-sm">{selectError}</p>
                ) : (
                  ''
                )}

                <Button
                  variant="gradient"
                  color='blue'
                  className="mt-5"
                  type="submit"
                  fullWidth
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Add
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
       
      </div>
    </Layout>
  );
};

export default CustomDatePicker;
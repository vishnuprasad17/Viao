import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VendorRootState from "../../../redux/rootstate/VendorState";
import Layout from "../../../layout/vendor/Layout";
import Pagination from "../../../components/common/Pagination";
import { Button, Dialog, Input, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { createService, deleteService, getServices, updateService } from "../../../config/services/venderApi";
import { Service } from "../../../interfaces/commonTypes";
import { validateService } from "../../../validations/vendor/serviceVal";

interface FormErrors {
  name: string;
  price: string;
  advancePercentage: string;
  minimumBookingNoticeInDays: string;
  cancellationFullRefundBeforeDays: string;
  cancellationPartialRefundBeforeDays: string;
  partialRefundPercentage: string;
}

interface ServiceForm {
  name: string;
  price: string;
  advancePercentage: string;
  minimumBookingNoticeInDays: string;
  cancellationFullRefundBeforeDays: string;
  cancellationPartialRefundBeforeDays: string;
  partialRefundPercentage: string;
}

const emptyForm: ServiceForm = {
  name: "",
  price: "",
  advancePercentage: "100",
  minimumBookingNoticeInDays: "1",
  cancellationFullRefundBeforeDays: "7",
  cancellationPartialRefundBeforeDays: "",
  partialRefundPercentage: "",
};

const emptyErrors: FormErrors = {
  name: "",
  price: "",
  advancePercentage: "",
  minimumBookingNoticeInDays: "",
  cancellationFullRefundBeforeDays: "",
  cancellationPartialRefundBeforeDays: "",
  partialRefundPercentage: "",
};

const Services = () => {
  const vendor = useSelector((state: VendorRootState) => state.vendor.vendordata);
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>(emptyErrors);

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const fetchServices = async (page: number) => {
    try {
      const response = await getServices(vendor?.id, page);
      setServices(response.data.services);
      setTotalPages(response.data.totalPages);
    } catch {
      toast.error("Error fetching services");
    }
  };

  const handleAddNew = () => {
    setEditMode(false);
    setFormData(emptyForm);
    setErrors(emptyErrors);
    setOpenDialog(true);
  };

  const handleEdit = (service: Service) => {
    setEditMode(true);
    setCurrentService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      advancePercentage: (service.advancePercentage ?? 100).toString(),
      minimumBookingNoticeInDays: (service.minimumBookingNoticeInDays ?? 1).toString(),
      cancellationFullRefundBeforeDays: (service.cancellationFullRefundBeforeDays ?? 7).toString(),
      cancellationPartialRefundBeforeDays: service.cancellationPartialRefundBeforeDays?.toString() ?? "",
      partialRefundPercentage: service.partialRefundPercentage?.toString() ?? "",
    });
    setErrors(emptyErrors);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    const validationErrors = validateService(formData);

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== "")) return;
    
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      advancePercentage: Number(formData.advancePercentage),
      minimumBookingNoticeInDays: Number(formData.minimumBookingNoticeInDays),
      cancellationFullRefundBeforeDays: Number(formData.cancellationFullRefundBeforeDays),
      cancellationPartialRefundBeforeDays: formData.cancellationPartialRefundBeforeDays
        ? Number(formData.cancellationPartialRefundBeforeDays)
        : null,
      partialRefundPercentage: formData.partialRefundPercentage
        ? Number(formData.partialRefundPercentage)
        : null,
    };

    try {
      if (editMode && currentService) {
        await updateService(currentService.id, payload);
        toast.success("Service updated successfully");
      } else {
        await createService(vendor?.id, payload);
        toast.success("Service created successfully");
      }
      setOpenDialog(false);
      fetchServices(currentPage);
    } catch {
      toast.error("Error saving service");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast.success("Service deleted successfully");
      fetchServices(currentPage);
    } catch {
      toast.error("Error deleting service");
    }
  };

  const field = (
    label: string,
    key: keyof ServiceForm,
    type = "text",
    errorKey?: keyof FormErrors
  ) => (
    <div>
      <Input
        label={label}
        type={type}
        value={formData[key]}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, [key]: e.target.value }))
        }
        error={!!(errorKey && errors[errorKey])}
        crossOrigin={undefined}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
      {errorKey && errors[errorKey] && (
        <Typography variant="small" color="red" className="mt-1"
          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {errors[errorKey]}
        </Typography>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 dark:text-white"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Manage Services
          </Typography>
          <Button color="purple" onClick={handleAddNew}
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Add New Service
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <Typography variant="h5" className="text-lg font-semibold text-gray-900 dark:text-white"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {service.name}
                </Typography>
                <div className="flex gap-2">
                  <Button size="sm" color="blue-gray" variant="outlined" onClick={() => handleEdit(service)}
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Edit
                  </Button>
                  <Button size="sm" color="red" variant="outlined" onClick={() => handleDelete(service.id)}
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Delete
                  </Button>
                </div>
              </div>

              <Typography className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-3"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                ₹{service.price.toLocaleString()}
              </Typography>

              {/* Policy summary */}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 border-t pt-2">
                <p>Advance: <span className="font-medium text-gray-700">{service.advancePercentage ?? 100}%</span></p>
                <p>Min. notice: <span className="font-medium text-gray-700">{service.minimumBookingNoticeInDays ?? 1} day(s)</span></p>
                <p>Full refund if cancelled ≥ <span className="font-medium text-gray-700">{service.cancellationFullRefundBeforeDays ?? 7} days</span> before</p>
                {service.cancellationPartialRefundBeforeDays && (
                  <p>Partial refund ({service.partialRefundPercentage}%) if cancelled ≥ <span className="font-medium text-gray-700">{service.cancellationPartialRefundBeforeDays} days</span> before</p>
                )}
                {!service.cancellationPartialRefundBeforeDays && (
                  <p className="text-red-500">No refund if cancelled inside {service.cancellationFullRefundBeforeDays ?? 7} days</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {services.length > 0 && (
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} isTable={false} />
          </div>
        )}

        {/* Add / Edit Dialog */}
        <Dialog open={openDialog} handler={() => setOpenDialog(false)}
          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className="p-6 max-h-[90vh] overflow-y-auto">
            <Typography variant="h4" className="mb-6"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {editMode ? "Edit Service" : "New Service"}
            </Typography>

            <div className="space-y-4">
              {field("Service Name", "name", "text", "name")}
              {field("Price (₹)", "price", "number", "price")}

              <div className="border-t pt-4">
                <Typography variant="small" className="font-semibold text-gray-600 mb-3 uppercase tracking-wide"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Booking Policy
                </Typography>
                {field("Advance Payment (%)", "advancePercentage", "number", "advancePercentage")}
                <p className="text-xs text-gray-400 mt-1 mb-3">Percentage of total price collected at booking. E.g. 30 means 30% advance.</p>
                {field("Minimum Booking Notice (days)", "minimumBookingNoticeInDays", "number", "minimumBookingNoticeInDays")}
                <p className="text-xs text-gray-400 mt-1 mb-3">Minimum days before event a booking can be made.</p>
              </div>

              <div className="border-t pt-4">
                <Typography variant="small" className="font-semibold text-gray-600 mb-3 uppercase tracking-wide"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Cancellation Policy
                </Typography>
                {field("Full Refund if Cancelled ≥ (days before event)", "cancellationFullRefundBeforeDays", "number", "cancellationFullRefundBeforeDays")}
                <p className="text-xs text-gray-400 mt-1 mb-3">E.g. 7 = full refund if cancelled 7+ days before event.</p>

                {field("Partial Refund if Cancelled ≥ (days before event, optional)", "cancellationPartialRefundBeforeDays", "number")}
                <p className="text-xs text-gray-400 mt-1 mb-3">Optional. E.g. 3 = partial refund window is 3–6 days before event.</p>

                {field("Partial Refund % (optional)", "partialRefundPercentage", "number")}
                <p className="text-xs text-gray-400 mt-1 mb-3">Optional. E.g. 50 = 50% refund in partial window.</p>

                {/* Live policy preview */}
                {formData.price && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg text-sm text-purple-800 space-y-1">
                    <p className="font-semibold">Policy Preview</p>
                    <p>✅ Full refund if cancelled ≥ {formData.cancellationFullRefundBeforeDays || "?"} days before</p>
                    {formData.cancellationPartialRefundBeforeDays && formData.partialRefundPercentage && (
                      <p>🔶 {formData.partialRefundPercentage}% refund if cancelled {formData.cancellationPartialRefundBeforeDays}–{formData.cancellationFullRefundBeforeDays} days before</p>
                    )}
                    <p>❌ No refund if cancelled &lt; {formData.cancellationPartialRefundBeforeDays || formData.cancellationFullRefundBeforeDays || "?"} days before</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="text" onClick={() => setOpenDialog(false)}
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Cancel
                </Button>
                <Button color="purple" onClick={handleSubmit}
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {editMode ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Services;
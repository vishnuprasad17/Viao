import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VendorRootState from "../../../redux/rootstate/VendorState";
import Layout from "../../../layout/vendor/Layout";
import Pagination from "../../../components/common/Pagination";
import { Button, Dialog, Input, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../../../config/services/venderApi";
import { Service } from "../../../interfaces/commonTypes";
import { validateService } from "../../../validations/vendor/serviceVal";

interface FormErrors {
  name: string;
  price: string;
}

const Services = () => {
  const vendor = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [errors, setErrors] = useState<FormErrors>({ name: "", price: "" });

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const fetchServices = async (page: number) => {
    try {
      const response = await getServices(vendor?.id, page);
      setServices(response.data.services);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Error fetching services");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setErrors({ name: "", price: "" }); // Reset errors on close
  };

  const handleAddNew = () => {
    setEditMode(false);
    setFormData({ name: "", price: "" });
    setErrors({ name: "", price: "" }); // Reset errors when opening dialog
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      if (editMode && currentService) {
        await updateService(currentService.id, {
          ...formData,
          price: Number(formData.price),
        });
        toast.success("Service updated successfully");
      } else {
        await createService(vendor?.id, {
          ...formData,
          price: Number(formData.price),
        });
        toast.success("Service created successfully");
      }
      setOpenDialog(false);
      fetchServices(currentPage);
    } catch (error) {
      toast.error("Error saving service");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast.success("Service deleted successfully");
      fetchServices(currentPage);
    } catch (error) {
      toast.error("Error deleting service");
    }
  };

  const handleEdit = (service: Service) => {
    setEditMode(true);
    setCurrentService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
    });
    setErrors({ name: "", price: "" });
    setOpenDialog(true);
  };

  const validateForm = () => {
    const validationErrors = validateService(formData);
    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => error === "");
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateService({ ...prev, [field]: value })[field],
      }));
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <Typography
            variant="h2"
            className="text-2xl font-bold text-gray-900 dark:text-white"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Manage Services
          </Typography>
          <Button
            color="purple"
            onClick={handleAddNew}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Add New Service
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <Typography
                  variant="h5"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {service.name}
                </Typography>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="blue-gray"
                    variant="outlined"
                    onClick={() => handleEdit(service)}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="red"
                    variant="outlined"
                    onClick={() => handleDelete(service.id)}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <Typography
                className="text-2xl font-bold text-purple-600 dark:text-purple-400"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                ₹{service.price.toLocaleString()}
              </Typography>
            </div>
          ))}
        </div>

        {services.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
              isTable={false}
            />
          </div>
        )}

        <Dialog
          open={openDialog}
          handler={handleDialogClose}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="p-6">
            <Typography
              variant="h4"
              className="mb-6"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {editMode ? "Edit Service" : "New Service"}
            </Typography>
            <div className="space-y-4">
              <div>
                <Input
                  label="Service Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!errors.name}
                  crossOrigin={undefined}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {errors.name && (
                  <Typography
                    variant="small"
                    color="red"
                    className="mt-1"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {errors.name}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Amount"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  error={!!errors.price}
                  crossOrigin={undefined}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {errors.price && (
                  <Typography
                    variant="small"
                    color="red"
                    className="mt-1"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {errors.price}
                  </Typography>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="text"
                  onClick={() => setOpenDialog(false)}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Cancel
                </Button>
                <Button
                  color="purple"
                  onClick={handleSubmit}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
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
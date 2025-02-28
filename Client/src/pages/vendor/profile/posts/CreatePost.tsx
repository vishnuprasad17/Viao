import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { addPost } from "../../../../config/services/venderApi";
import Breadcrumb from "../../../../components/vendor/Breadcrumbs/Breadcrumb";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import VendorRootState from "../../../../redux/rootstate/VendorState";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { VENDOR } from "../../../../config/routes/vendor.routes";
import Layout from "../../../../layout/vendor/Layout";
import { validatePost } from "../../../../validations/vendor/postVal";

interface PostValidationErrors {
  caption: string;
  image: string;
}

const CreatePost = () => {
  const vendor = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [caption, setCaption] = useState<string>("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [cropData, setCropData] = useState("#");
  const cropperRef = useRef<ReactCropperElement>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<PostValidationErrors>({
    caption: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result as any);
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        setCroppedImageBlob(blob);
        setCropData(URL.createObjectURL(blob!));
      });
      setShowPreview(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate inputs
    const validationErrors = validatePost({
      caption,
      hasImage: !!file || !!croppedImageBlob,
    });

    setErrors(validationErrors);

    // Check if there are any errors
    if (Object.values(validationErrors).some((error) => error !== "")) {
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (croppedImageBlob) {
      formData.append("image", croppedImageBlob, "croppedImage.png");
    } else if (file) {
      formData.append("image", file, file.name);
    }

    setIsLoading(!isLoading);

    addPost(vendor?.id, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log(response);
        toast.success("Post added successfully...!");
        setIsLoading(!isLoading);
        navigate(`${VENDOR.VIEW_POSTS}`);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log("here", error);
      });
  };
  return (
    <Layout>
      <Breadcrumb pageName="Add Post" folderName="Posts" />

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card
            className="shadow-lg rounded-2xl"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardHeader
              color="deep-purple"
              floated={false}
              shadow={false}
              className="m-0 grid rounded-t-2xl bg-gradient-to-r from-blue-900 to-purple-400 h-32 place-items-center"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="h3"
                color="white"
                className="font-bold"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Create New Post
              </Typography>
            </CardHeader>

            <CardBody
              className="p-6 md:p-8"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Caption"
                      size="lg"
                      value={caption}
                      onChange={(e) => {
                        setCaption(e.target.value);
                        setErrors((prev) => ({ ...prev, caption: "" }));
                      }}
                      error={!!errors.caption}
                      crossOrigin={undefined}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    {errors.caption && (
                      <Typography
                        variant="small"
                        color="red"
                        className="mt-1 flex items-center gap-1 font-normal"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.caption}
                      </Typography>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Typography
                      variant="small"
                      className="text-blue-gray-500"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Upload Image
                    </Typography>
                    <Input
                      type="file"
                      size="lg"
                      onChange={onChange}
                      accept="image/*"
                      className="file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      error={!!errors.image}
                      crossOrigin={undefined}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    {errors.image && (
                      <Typography
                        variant="small"
                        color="red"
                        className="mt-1 flex items-center gap-1 font-normal"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.image}
                      </Typography>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-900 to-blue-400 hover:shadow-lg transition-all"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Publish Post"
                  )}
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Image Editing Section */}
          <div className="space-y-8">
            {imageSrc && (
              <>
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-4"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Crop Image
                  </Typography>

                  <Cropper
                    className="rounded-lg overflow-hidden shadow-sm"
                    style={{ height: 400, width: "100%" }}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={imageSrc}
                    ref={cropperRef}
                    viewMode={1}
                    guides={true}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                    responsive={true}
                    checkOrientation={false}
                  />

                  <div className="mt-4 flex justify-end">
                    <Button
                      color="deep-purple"
                      onClick={getCropData}
                      className="flex items-center gap-2"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V2zm4 11a1 1 0 100-2 1 1 0 000 2zm0 2a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Crop Image
                    </Button>
                  </div>
                </div>

                {showPreview && (
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="mb-4"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Preview
                    </Typography>
                    <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                      <img
                        className="w-full h-full object-contain"
                        src={cropData}
                        alt="Cropped preview"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
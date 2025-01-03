import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { addPost } from "../../../../config/services/venderApi"
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

const CreatePost = () => {
  const vendor = useSelector(
    (state: VendorRootState) => state.vendor.vendordata
  );

  useEffect(() => {
    console.log(vendor?._id);
  }, []);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [caption, setCaption] = useState<string>("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [cropData, setCropData] = useState("#");
  const cropperRef = useRef<ReactCropperElement>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [showPreview,setShowPreview]=useState(false)

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
    if (!caption) {
      toast.error("Caption is required.", {
        style: {
          background: "#FF4136", // Red background
          color: "#FFFFFF", // White text
        },
        duration: 3000,
      });
      return;
    }
    if (!file && !croppedImageBlob) {
      toast.error("Image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (croppedImageBlob) {
      formData.append("image", croppedImageBlob, "croppedImage.png");
    } else if (file) {
      formData.append("image", file, file.name);
    }

    addPost(vendor?._id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log(response);
        toast.success("Post added successfully...!");
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
      <div className="flex justify-center flex-wrap mb-20">
        {/* Add Post Card */}
        <Card
          className="w-full bg-blue-gray-50 md:w-96 mx-4 my-20"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardHeader
            variant="gradient"
            className="mb-4 grid h-28 place-items-center bg-blue-gray-500"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography
              variant="h3"
              color="white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Add Post
            </Typography>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardBody
              className="flex flex-col gap-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Input
                label="Caption"
                size="lg"
                onChange={(e) => {
                  setCaption(e.target.value);
                }}
                value={caption}
                name="caption"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
              <Input
                type="file"
                size="lg"
                onChange={onChange}
                name="image"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
              <Button
                variant="gradient"
                color="blue"
                type="submit"
                fullWidth
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Add
              </Button>
            </CardBody>
          </form>
        </Card>

        {/* Cropping Section */}
        <div className="flex flex-col md:flex-row mb-20 justify-between w-full">
          <div className="w-full md:w-1/2">
            {/* Cropping Section */}
            <Cropper
              style={{ height: 400, width: "90%", marginRight: "10px" }}
              initialAspectRatio={1}
              preview=".img-preview"
              src={imageSrc}
              ref={cropperRef}
              viewMode={1}
              guides={true}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            />
            {file && (
              <Button
                className="float-right md:float-none mt-4 md:mt-0"
                color="blue"
                onClick={getCropData}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Crop Image
              </Button>
            )}
          </div>

          {/* Preview of Cropped Image */}
          {showPreview && (
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="box">
                <h1>
                  <span>Preview of Cropped image</span>
                </h1>
                <img
                  className="shadow-lg"
                  style={{ width: "70%", height: "300" }}
                  src={
                    cropData.length > 0
                      ? cropData
                      : "/imgs/vendor/preview-default.svg"
                  }
                  alt="cropped"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
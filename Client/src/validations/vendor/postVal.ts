interface PostValidationErrors {
  caption: string;
  image: string;
}

interface PostValidationValues {
  caption: string;
  hasImage: boolean;
}

export const validatePost = (values: PostValidationValues): PostValidationErrors => {
  const errors: PostValidationErrors = {
    caption: "",
    image: ""
  };

  // Caption validation
  if (!values.caption.trim()) {
    errors.caption = "Caption is required";
  }

  // Image validation
  if (!values.hasImage) {
    errors.image = "Image is required";
  }

  return errors;
};
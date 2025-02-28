interface ServiceValidationErrors {
    name: string;
    price: string;
  }
  
  interface ServiceValidationValues {
    name: string;
    price: string; // Keep as string to match form input type
  }
  
  export const validateService = (values: ServiceValidationValues): ServiceValidationErrors => {
    const errors: ServiceValidationErrors = {
      name: "",
      price: ""
    };
  
    // Name validation
    if (!values.name.trim()) {
      errors.name = "Service name is required";
    }
  
    // Amount validation
    if (!values.price) {
      errors.price = "Amount is required";
    } else {
      const priceValue = parseFloat(values.price);
      if (isNaN(priceValue)) {
        errors.price = "Valid number is required";
      } else if (priceValue <= 0) {
        errors.price = "Amount must be greater than 0";
      }
    }
  
    return errors;
  };
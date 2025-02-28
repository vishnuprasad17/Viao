interface ValidationErrors {
  serviceId: string;
  name:string;
  date:string;
  city:string;
  pin:string;
  mobile:string;
 
   }
   
   interface ValidationValues {
    serviceId: string;
    name:string;
    date:string;
    city:string;
    pin:string;
    mobile:string;

   }

export const validate =  (values: ValidationValues): ValidationErrors => {
   const errors: ValidationErrors = {
    serviceId: '',
    name:'',
    date:'',
    city:'',
    pin:'',
    mobile:''
   };



  if (!values.serviceId) {
    errors.serviceId = 'Please select a service';
  }

  if (!values.name.trim()) {
    errors.name = 'name is required';
  } else if (!/^[A-Za-z\s]+$/i.test(values.name)) {
    errors.name = 'Should not contain numbers!';
  }

  if (!values.date.trim()) {
    errors.date = 'Select a date';
  }


  if (!values.city.trim()) {
    errors.city = 'Place is required';
  } else if (!/^[A-Za-z\s]+$/i.test(values.city)) {
    errors.city = 'Should not contain numbers!';
  }


  if (!values.mobile.trim()) {
    errors.mobile = 'Phone is equired';
  } else if(!/^[0-9]+$/u.test(values.mobile)) {
    errors.mobile = 'Should not include characters';
  }else if (values.mobile.length!==10) {
    errors.mobile = 'Should contain 10 numbers';
  }


  if (!values.pin.trim()) {
    errors.pin = 'Pin is equired';
  } else if(!/^[0-9]+$/u.test(values.pin)) {
    errors.pin = 'Should not include characters';
  }else if (values.pin.length!==6) {
    errors.pin = 'Should contain 6 numbers';
  }

 
   return errors;
 };
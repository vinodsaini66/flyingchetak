import * as yup from 'yup';
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
const schemaPhone = yup.object({
  name: yup.string()
    .required('Name is required'),
  email: yup.string().matches(emailRegex, 'Invalid email').required('Email is required'),
  mobile_number: yup.string()
    .required('Mobile number is required')
    .length(10, 'Must be exactly 10 digits'),
  gender: yup.string()
    .required('Password is required'),
  dob:yup
  .date()
  .max(new Date(), 'DOB cannot be in the future')
  // .min(new Date('1900-01-01'), 'Invalid DOB')s
  .max(new Date(Date.now() - 567648000000), "You must be at least 18 years")
  .required('DOB is required'),
  });

  export const ProfileVal = async (name: string, value: string) => {
    try {
      await schemaPhone.validateAt(name,{ [name]: value });
      return null; // No errors
    } catch (error:any) {
      return error.errors[0]; // Return the first validation error
    }
  };
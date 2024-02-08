import * as yup from 'yup';
const schemaPhone = yup.object({
  mobile_number: yup.string()
    .required('Mobile number is required')
    // .matches(/^\d+$/, 'Must be only digits')
    .length(10, 'Must be exactly 10 digits'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      'Password must contain at least one uppercase letter, one special character, and be at least 8 characters long'
    )
  });

  export const LoginVal = async (name: string, value: string) => {
    try {
      await schemaPhone.validateAt(name,{ [name]: value });
      return null; // No errors
    } catch (error:any) {
      return error.errors[0]; // Return the first validation error
    }
  };
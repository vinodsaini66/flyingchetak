import * as yup from 'yup';
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
const schemaPhone = yup.object({
  name: yup.string()
    .required('Name is required'),
  email: yup.string().matches(emailRegex, 'Invalid email').required('Email is required'),
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
    ),
    Cpassword: yup.string()
    .required('Confirm Password is required'),
  referral_from_id:yup.string().optional()
  });

  export const RegisterVal = async (name: string, value: string) => {
    try {
      await schemaPhone.validateAt(name,{ [name]: value });
      return null; // No errors
    } catch (error:any) {
      return error.errors[0]; // Return the first validation error
    }
  };

  // export const PhoneNumberValidation = async (name: String, number: string) => {

  //   switch(name){
  //     case "phonenumber":
  //       try {
  //         await schemaPhone.validate({ phonenumber: number });
  //         return null; // No errors
  //       } catch (error:any) {
  //   console.log("jhbjhbbsdfdfhjdb",error)
  //         return error.errors[0]; // Return the first validation error
  //       }
  //     case "password":  try {
  //       await schemaPhone.validate({ password: number });
  //       return null; // No errors
  //     } catch (error:any) {
  //       return error.errors[0]; // Return the first validation error
  //     }
  //     case "Cpassword":   try {
  //       await schemaPhone.validate({ Cpassword: number });
  //       return null; // No errors
  //     } catch (error:any) {
  //       return error.errors[0]; // Return the first validation error
  //     }

  //   }
  
  // };
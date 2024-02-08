
import * as yup from 'yup';
const ifscRegex = /^[A-Za-z]{4}\d{7}$/;
const schemaBalance = yup.object().shape({
    account_holder: yup.string().required('This field is required'),
                        // .length(2,'Name must be more than 2 digit'),
    ifsc_code: yup.string().required('This field is required')
                        .matches(/^[A-Za-z]{4}\d{7}$/, 'Invalid IFSC code'),
    account_number: yup.string().required('Account number is required')
                                .min(6, 'Invalid Account number')
                                .max(20, 'Invalid Account number')
                                
  });

const BankValidation = async(name:string,balance:number) => {
    try {
        await schemaBalance.validateAt(name,{ [name]: balance });
        return null; // No errors
      } catch (error:any) {
        return error.errors[0]; // Return the first validation error
      }
}
export default BankValidation
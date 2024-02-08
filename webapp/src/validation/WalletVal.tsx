
import * as yup from 'yup';
const schemaBalance = yup.object().shape({
    balance: yup.number().required('Balance is required')
                        .positive('Balance must be greater than 0')
  });

const WalletVal = async(name:string,balance:number) => {
    let finalbalance = Number(balance)
    try {
        await schemaBalance.validateAt(name,{ [name]: finalbalance });
        return null; // No errors
      } catch (error:any) {
        return error.errors[0]; // Return the first validation error
      }
}
export default WalletVal
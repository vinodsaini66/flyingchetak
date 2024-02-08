export interface UserInput {
    name:string;
    email:string;
    mobile_number: string;
    password: string;
    Cpassword: string;
    referral_from_id: string;
    country_code:string;
    type:string
  }
export interface UserInputError {
    mobile_numberError: string;
    passwordError: string;
    CpasswordError: string;
    emailError:string;
    nameError:string;
    referral_from_idError: string;
  }
  
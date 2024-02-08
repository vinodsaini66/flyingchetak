export interface ProfileUserInput {
    name:string;
    email:string;
    mobile_number: string;
    dob:string;
    gender:string;
    
  }
export interface ProfileUserInputError {
    mobile_numberError: string;
    nameError: string;
    emailError: string;
    dobError: string;
    genderError: string;

  }
  
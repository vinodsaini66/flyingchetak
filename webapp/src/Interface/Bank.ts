export interface BankInfo {
    account_holder:string;
    ifsc_code:string,
    account_number:string
}
export interface BankInfoError {
    account_holderError:string;
    ifsc_codeError:string,
    account_numberError:string
}
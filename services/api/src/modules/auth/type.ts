export type Email = string;
export type Password = string;


export interface LoginData 
{
    email: string;
    password: Password;
}


export interface RegisterData 
{
    email: string;
    password: Password;
    confirmPassword: Password;
}
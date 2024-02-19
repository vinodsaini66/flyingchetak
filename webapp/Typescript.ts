/*====================================TypeScript With Reactjs=======================================================

1. for string,boolean,object,number as props 
            type nameProps = {
                       name:string,
                       isActive:boolean,
                       profile:object,
                       age:number
                  }

2. for Array of object 
            exa let profile=[{
                fname:"Mujjkir",
                lname:"Ansari"
            }]
            type arryaProps = {
                profile:{
                    fname:string,
                    lname:string
                }[]
            }

3. for some perticular's string (Which means that props.status can be three type nothing else)
            type stringProps = {
                status:'Success' | 'Pending' | 'Error'
            }
    exa: <Profile status = "Success"/>
         const Profile = (props:stringProps) => {...}


4. for any component which is passed as a children to another component
            type childrenProps = {
                children:React.ReactNode
            }
    exa: <User>
            <Profile/>
        </User> 

    const User = (props:childrenProps) => {...} 

5. for optional data as Props
            type optionalProps={
                name:string,
                status?:string
            }
    Note:  We use question mark (?) if data come from parent to children is optional.

6 for Mouse button event
            type buttonProps = {
                handleClick:()=>void    // if button don't have any parameters 
                handleClick:(event:React.MouseEvent <HTMLButtonElement>,id:number)
            }

7 for Mouse input event
            type inputProps = {
                handleChange:(event:React.ChangeEvent <HTMLInputElement>)=>void
            }




*/
export interface TimePickerProps{
     label:string, 
     value:string, 
     disabled?:boolean 
     onChange :(newValue: string | null) => void;
}
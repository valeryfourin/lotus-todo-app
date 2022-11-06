import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import { purple } from "@mui/material/colors";
import { forwardRef, MutableRefObject, useEffect, useRef } from "react";

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: purple[300],
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: purple[300],
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: purple[300],
      },
    },
  });

export const StyledTextField = ({...props}: any) => {
    
//   const myRef = useRef<any>(null);
//     useEffect(() => {
//         console.log(ref);
        
//     });
    return ( <CssTextField {...props}  /> )
};
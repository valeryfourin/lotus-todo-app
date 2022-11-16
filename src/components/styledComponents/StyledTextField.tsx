import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import { purple } from "@mui/material/colors";

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
    return ( <CssTextField {...props}  /> )
};

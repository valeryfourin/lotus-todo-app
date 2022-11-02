import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import { borderColor } from '@mui/system';

const ColorButton = styled(Button)<ButtonProps>(({variant}) => ({
  color: variant === "contained" ? 'white' : purple[200],
  backgroundColor: variant === "contained" ? purple[200] : 'transparent',
  ...(variant === "outlined" && { borderColor: purple[200] }),
  '&:hover': {
    backgroundColor: variant === "contained" ? purple[700] : 'transparent',
    ...(variant === "outlined" && { borderColor: purple[700], color: purple[700] }),
  },
}));

export const StyledButton = ({title, ...props}: any): JSX.Element => {
  return (
    <ColorButton variant="contained" {...props}>{title}</ColorButton>
  );
}

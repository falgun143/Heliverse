import { Button, ButtonProps } from '@mui/material'
import React, { FC } from 'react'

interface CustomButtonProps extends ButtonProps {
    text?: string; // Make text optional if you want to support children
  }
  const CustomButton: FC<CustomButtonProps> = ({ text, ...props }) => {
    return (
     <Button
      variant="contained"
      style={{ padding: 9, width: 100, borderRadius: 20, backgroundColor:"#146fe6" }}
      {...props} 
     >
      {text} 
     </Button>
    )
  }

export default CustomButton
import React from 'react'
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const AlertComponent = ({ open, handleClose, message, severity }) => {
   return (
     <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
       <MuiAlert
         onClose={handleClose}
         severity={severity}
         sx={{ width: "100%" }}
       >
         {message}
       </MuiAlert>
     </Snackbar>
   );
}

export default AlertComponent

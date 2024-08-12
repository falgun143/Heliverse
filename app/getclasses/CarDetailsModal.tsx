"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { Car } from "./page";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CarDetailsModalProps = {
  car: Car | null;
  onClose: () => void;
  onUpdate: (updatedCar: Car) => void;
  userRole: "USER" | "ADMIN";
};

const CarDetailsModal: React.FC<CarDetailsModalProps> = ({
  car,
  onClose,
  onUpdate,
  userRole,
}) => {
  const [carname, setCarname] = useState(car?.carname || "");
  const [manufacturingdate, setManufacturingdate] = useState(
    car?.manufacturingdate || ""
  );
  const [price, setPrice] = useState(car?.price || "");
  const [image, setImage] = useState(car?.image || "");

  const handleCarUpdate = async () => {
    if (!car) return;

    try {
      const response = await axios.put(`/api/car/${car.id}`, {
        carname,
        manufacturingdate,
        price,
        image,
      });
      toast.success("Updating Car");
      setTimeout(()=>{
        onClose();
        onUpdate(response.data.car);
      },2000)
   
      
      
    } catch (error: any) {
      toast.success(error.message);
    }
  };

  if (!car) {
    return null;
  }

  return (
    <>
      <ToastContainer  autoClose={2000} theme="dark" />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        <Card
          sx={{
            width: "90%",
            maxWidth: 600,
            padding: 3,
            backgroundColor: "white",
            borderRadius: 2,
            position: "relative",
            boxShadow: 3,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom>
            {car.carname}
          </Typography>
          <TextField
            label="Car Name"
            variant="outlined"
            fullWidth
            value={carname}
            onChange={(e) => setCarname(e.target.value)}
            sx={{ marginBottom: 2 }}
            color="success"
          />
          <TextField
            label="Manufacturing Year"
            variant="outlined"
            fullWidth
            type="date"
            value={manufacturingdate}
            onChange={(e) => setManufacturingdate(e.target.value)}
            sx={{ marginBottom: 2 }}
            color="success"
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ marginBottom: 2 }}
            color="success"
          />
          <TextField
            label="Image URL"
            variant="outlined"
            fullWidth
            value={image}
            onChange={(e) => setImage(e.target.value)}
            sx={{ marginBottom: 2 }}
            color="success"
          />

          {userRole === "ADMIN" && (
            <Button
              variant="contained"
              style={{ marginTop: 2,  backgroundColor:"#e47200" }}
              onClick={handleCarUpdate}
            
            >
              Save Changes
            </Button>
          )}
        </Card>
      </Box>
    </>
  );
};

export default CarDetailsModal;

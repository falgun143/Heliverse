"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLogin } from "../../context/LoginContext";
import { LoginSchema } from "@/utils/validationSchema";
interface User {
  id: string;
  email: string;
  password: string;
  role:string
}
const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState({id:"",email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const { login , role } = useLogin();

  useEffect(() => {
    if (login) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/getusers");
 
      setLoading(false);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const validateField = (field: string, value: string) => {
    const result = LoginSchema.safeParse({ [field]: value });
    if (!result.success) {
      return (
        result.error.errors.find((err) => err.path.includes(field)) || null
      );
    }
    return null;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    console.log(name, value);

    // Clear error for the field being updated
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path !== name)
    );

    // Update the state for the specific input field
    if (name === "email") {
      setEditUser({...editUser, email: value});
    } else if (name === "password") {
      setEditUser({...editUser, password: value});
    }

    // If the value is empty, clear the error for that field
    if (value.trim() === "") {
      setErrors((prevErrors) =>
        prevErrors.filter((error) => error.path !== name)
      );
      return;
    }

    // Validate the updated field if it is not empty
    if (error) {
      setErrors((prevErrors) => [
        ...prevErrors,
        { path: name, message: error.message },
      ]);
    }
  };

  const handleEditOpen = (user: User) => {
    setEditUser(user);
    setOpen(true);
  };

  const handleEditClose = () => {
    setOpen(false);
  };

  const handleEditSave = async () => {
    if(errors.length==0){
      try {
        await axios.put(`/api/edituser/${editUser.id}`, {
          email: editUser.email,
          password: editUser.password
        });
        toast.success("User Details Edited");
        fetchUsers();
        setOpen(false);
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    }
    else{
      return 
    }
  
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`/api/deleteuser/${userId}`);
      toast.success("User Deleted");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (!login) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: "#333" }}>
          You are not logged in
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#666" }}>
          Please log in to view the details of users.
        </Typography>
        <Button
          variant="contained"
          style={{ borderRadius:17 }}
          onClick={() => (window.location.href = "/login")}
        >
          Go to Login
        </Button>
      </Box>
    );
  }
  if(role!="PRINCIPAL"){
    
  }

  
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Loading Users, please wait...
        </Typography>
      </Box>
    );
  }

  return (
    <>
  <ToastContainer   autoClose={1500}   theme="dark" />
    <div style={{width: "100%", display:"flex", flexDirection: "column", alignItems: "center",justifyContent: "center"}} >
      <h1>Users</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                 <TableCell>{user.password}</TableCell>
                 <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditOpen(user)}>
                    <Edit style={{ color: "orange" }} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <Delete style={{ color: "red" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={editUser.email}
            error={errors.some((err) => err.path === "email")}
            helperText={errors.find((err) => err.path === "email")?.message}
            onChange={handleInputChange}
            
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            fullWidth
            error={errors.some((err) => err.path === "password")}
            helperText={errors.find((err) => err.path === "password")?.message}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
};

export default Users;

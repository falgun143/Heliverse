"use client";
import React from "react";
import {
  AppBar as MuiAppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Button,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { AiFillHome } from "react-icons/ai";
import { SiGoogleclassroom } from "react-icons/si";
import { IoSchool } from "react-icons/io5";
import Cookies from "js-cookie";
import { useLogin } from "../context/LoginContext";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import CustomButton from "./CustomButton";
export const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function AppBar(
  { children }: { children: React.ReactNode },
  props: Props
) {
  const token = Cookies.get("token");
  const { login, setLogin, role } = useLogin();

  const router = useRouter();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key={"Home"} disablePadding>
          <ListItemButton
            onClick={() => {
              handleDrawerClose();
              router.push("/");
            }}
          >
            <ListItemIcon>
              <AiFillHome />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>

        <ListItem key={"CreateClass"} disablePadding>
          <ListItemButton
            onClick={() => {
              handleDrawerClose();
              router.push("/addclass");
            }}
          >
            <ListItemIcon>
              <SiGoogleclassroom />
            </ListItemIcon>
            <ListItemText primary={"CreateClass"} />
          </ListItemButton>
        </ListItem>

        <ListItem key={"ViewClasses"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <IoSchool />
            </ListItemIcon>
            <ListItemText primary={"ViewClasses"} />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {login && (role == "PRINCIPAL" || "TEACHER") && (
              <CustomButton
                text=" Register"
                onClick={() => {
                  handleDrawerClose();
                  router.push("/signup");
                }}
              ></CustomButton>
            )}

            {login && (
              <CustomButton
                text=" Logout"
                onClick={() => {
                  handleDrawerClose();
                  setLogin(false);
                  Cookies.remove("token");
                  router.push("/")
                }}
              />
            )}

            {!login && (
              <CustomButton
                text="Login"
                onClick={() => {
                  handleDrawerClose();
                  router.push("/login");
                }}
              ></CustomButton>
            )}
          </Box>
        </ListItem>
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MuiAppBar
          elevation={0}
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "white",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: {
                xs: "space-between",
                sm: "right",
              },
              padding: 5,
            }}
          >
            <IconButton
              style={{ color: "grey" }}
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
                gap:2
              }}
            >
              {login && (role == "PRINCIPAL" || "TEACHER") && (
                <CustomButton
                  text="Register"
                  onClick={() => {
                    router.push("/signup");
                  }}
                ></CustomButton>
              )}

              {login && (
                <CustomButton
                  text="  Logout"
                  onClick={() => {
                    setLogin(false);
                    Cookies.remove("token");
                    router.push("/")
                  }}
                ></CustomButton>
              )}

              {!login && (
                <CustomButton
                  text=" Login"
                  onClick={() => {
                    router.push("/login");
                  }}
                ></CustomButton>
              )}
            </Box>
          </Toolbar>
        </MuiAppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 7,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
          style={{ overflowX: "auto" }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  );
}

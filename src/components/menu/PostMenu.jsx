import {
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { MdDelete, MdReport } from "react-icons/md";

const PostMenu = ({ onDelete, currentUserId, postAuthorId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete?.();
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? "post-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        size="small"
        sx={{
          color: theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <CiMenuKebab size={20} />
      </IconButton>

      <Menu
        id="post-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 2,
            py: 0.5,
            minWidth: 160,
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.menuBackground
                : "#fff",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0px 0px 1px rgba(255,255,255,0.05)"
                : "0px 0px 1px rgba(0,0,0,0.1)",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {currentUserId === postAuthorId && (
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <MdDelete fontSize={20} color="red" />
            </ListItemIcon>
            <ListItemText
              primary="Delete"
              primaryTypographyProps={{
                fontWeight: 500,
                color: theme.palette.error.main,
              }}
            />
          </MenuItem>
        )}

        {currentUserId === postAuthorId && <Divider sx={{ my: 0.5 }} />}

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <MdReport fontSize={20} color="orange" />
          </ListItemIcon>
          <ListItemText
            primary="Report"
            primaryTypographyProps={{
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default PostMenu;

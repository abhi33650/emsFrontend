"use client";

import {
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import {
  Email as EmailIcon,
  MarkEmailRead,
  MarkEmailUnread,
} from "@mui/icons-material";
import { ShowEmail } from "@/Interface/ShowEmail";

interface showEmailListProps {
  getEmail: ShowEmail[];
  selectedEmail: ShowEmail | null;
  formatDate: (date: string) => string;
  getInitials: (email: string) => string;
  setSelectedEmail: (email: ShowEmail | null) => void;
  onToggleRead: (id: number, isRead: number) => void;
}

const EmailList = ({
  getEmail,
  selectedEmail,
  formatDate,
  getInitials,
  setSelectedEmail,
  onToggleRead,
}: showEmailListProps) => {

  console.log(getEmail , ' this is email');
  
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper
        elevation={2}
        sx={{
          height: "calc(100vh - 200px)",
          overflow: "auto",
          borderRadius: 2,
        }}
      >
        <List sx={{ p: 0 }}>
          {getEmail.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <EmailIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
              <Typography color="text.secondary">
                No emails found
              </Typography>
            </Box>
          ) : (
            getEmail.map((email) => (
              <div key={email.Id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedEmail?.Id === email.Id}
                    onClick={(e) => {e.stopPropagation();
                      setSelectedEmail(email);   
                      onToggleRead(Number(email.Id),email.isRead ? 1 : 0);}}
                    sx={{
                      py: 2,

                      // ✅ Read / Unread color
                      backgroundColor: email.isRead
                        ? "#e8f5e9"   // 🟢 Read = green
                        : "#e3f2fd",  // 🔵 Unread = blue

                      "&.Mui-selected": {
                        backgroundColor: email.isRead
                          ? "#c8e6c9"
                          : "#bbdefb",
                        borderLeft: "4px solid #1976d2",
                      },

                      "&:hover": {
                        backgroundColor: email.isRead
                          ? "#dcedc8"
                          : "#f5f5f5",
                      },
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        bgcolor: "#1976d2",
                        mr: 2,
                        width: 45,
                        height: 45,
                      }}
                    >
                      {getInitials(email.Fromemail)}
                    </Avatar>

                    {/* Email Content */}
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          fontWeight={email.isRead ? 400 : 700} 
                          noWrap
                          sx={{ mb: 0.5 }}
                        >
                          {email.Subject || "No Subject"}
                        </Typography>
                      }
                      secondary={
                        <Box component="span">  
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ mb: 0.5, display: "block" }}
                          >
                            {email.Fromemail}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            {formatDate(email.RecivedDate)}
                          </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
  <Typography variant="body2" color="text.secondary" fontWeight="bold">
    Reply:
  </Typography>

  <Chip
    label={email?.RStatus || "Unknown"}
    size="small"
    sx={{
      fontWeight: "bold",
      backgroundColor:
        email?.RStatus?.toLowerCase() === "pending"
          ? "#ffebee"
          : "#e8f5e9",
      color:
        email?.RStatus?.toLowerCase() === "pending"
          ? "#d32f2f"
          : "#2e7d32",
      border:
        email?.RStatus?.toLowerCase() === "pending"
          ? "1px solid #d32f2f"
          : "1px solid #2e7d32",
    }}
  />
</Stack>
                        </Box>
                      }
                      secondaryTypographyProps={{
                        component: "div",
                      }}
                    />

                    {/* Toggle Read/Unread */}
                    <Tooltip
                      title={
                        email.isRead
                          ? "Mark as Unread"
                          : "Mark as Read"
                      }
                    >
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead(
                            Number(email.Id),
                            email.isRead ? 1 : 0
                          );
                        }}
                      >
                      
                       
                        {email.isRead ? (
                          <MarkEmailUnread />
                        ) : (
                          <MarkEmailRead />
                        )}
                      </IconButton>
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
                  
                <Divider />
              </div>
            ))
          )}
        </List>
      </Paper>
    </Grid>
  );
};

export default EmailList;

// "use client";

// import { getUserData } from "@/Action/ShowUser";
// import { ShowUserInterface } from "@/Interface/ShowUser";
// import { useEffect, useState } from "react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Typography,
//   CircularProgress,
// } from "@mui/material";

// const User = () => {
//   const [userData, setUserData] = useState<ShowUserInterface[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await getUserData();

//         if (response.status === "success") {
//           setUserData(response.data);
//         }
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleAssign = (user: ShowUserInterface) => {
//     console.log("Assign clicked for:", user);
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: 20 }}>
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <TableContainer component={Paper} sx={{ padding: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Registered Users
//       </Typography>

//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell><strong>ID</strong></TableCell>
//             <TableCell><strong>Email</strong></TableCell>
//             <TableCell align="center"><strong>Action</strong></TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {userData.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={3} align="center">
//                 No users found
//               </TableCell>
//             </TableRow>
//           ) : (
//             userData.map((user) => (
//               <TableRow key={user.Id}>
//                 <TableCell>{user.Id}</TableCell>
//                 <TableCell>{user.Email}</TableCell>
//                 <TableCell align="center">
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     size="small"
//                     onClick={() => handleAssign(user)}
//                   >
//                     Assign
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default User;


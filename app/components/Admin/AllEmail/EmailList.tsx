"use client";

import { Grid, Paper, Box, Typography,  Avatar, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Inbox as InboxIcon,
} from "@mui/icons-material";
import { ShowEmail } from "@/Interface/ShowEmail";

interface showEmailListProps{
 getEmail : ShowEmail[];
 selectedEmail:ShowEmail | null;
 formatDate: (date: string ) => string;
 getInitials: (email: string) => string;
 setSelectedEmail:(email : ShowEmail)=>void;
}
const EmailList = ({getEmail,selectedEmail,formatDate ,getInitials,setSelectedEmail}:showEmailListProps)=>{
  return(
    <>
       <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={2}
              sx={{height: "calc(100vh - 200px)",overflow: "auto",borderRadius: 2,}}>
              <List sx={{ p: 0 }}>
                {getEmail.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <EmailIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                    <Typography color="text.secondary">No emails found</Typography>
                  </Box>
                ) : (
                  getEmail.map((email, index) => (
                    <div key={index}>
                      <ListItem disablePadding>
                        <ListItemButton selected={selectedEmail?.Id === email.Id} onClick={() => setSelectedEmail(email)}
                          sx={{py: 2,
                            "&.Mui-selected": {
                              backgroundColor: "#e3f2fd",
                              borderLeft: "4px solid #1976d2",
                              "&:hover": {
                                backgroundColor: "#e3f2fd",
                              },
                            },
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <Avatar sx={{bgcolor: "#1976d2",mr: 2,width: 45,height: 45,}}>{getInitials(email.Fromemail)}</Avatar>
                          <ListItemText
                            primary={<Typography variant="subtitle1" fontWeight="600" noWrap sx={{ mb: 0.5 }}>
                                {email.Subject || "No Subject"}
                              </Typography>
                            }
                            secondary={
                              <Box component="span">
                                <Typography component="span" variant="body2" color="text.secondary" noWrap sx={{ mb: 0.5, display: "block" }}>
                                  {email.Fromemail}
                                </Typography>
                                <Typography component="span" variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                  {formatDate(email.RecivedDate)}
                                </Typography>
                              </Box>
                            }
                            secondaryTypographyProps={{
                              component: "div"
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                      {index < getEmail.length - 1 && <Divider />}
                    </div>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
    </>
  )
}
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


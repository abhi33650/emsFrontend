"use cleint"
import {
  Box,
  Typography,
  Avatar,
  Tooltip,
} from "@mui/material";
      
import PersonIcon from "@mui/icons-material/Person";
import type { ShowUserInterface } from "@/Interface/ShowUser";

interface ShowUserListProps{  
    getInitials: (email: string) => string;
    usersLoading: boolean;
   filteredUsers: ShowUserInterface[];
    search:string;
   selectedUser: ShowUserInterface | null; 
    getColor: (i: number) => string; 
   handleSelect: (user: ShowUserInterface) => void;
    users:ShowUserInterface[]

  }
const UserList = ({getInitials ,usersLoading,filteredUsers,search,selectedUser,getColor,handleSelect , users}:ShowUserListProps)=>{
  const G = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  return(
    <>
    {/* User list */}
            <Box sx={{ flex: 1, overflowY: "auto", "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#e0d8f5", borderRadius: 4 } }}>
              {usersLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                  <Typography variant="caption" sx={{ color: "#b0a8c8" }}>Loading users…</Typography>
                </Box>
              ) : filteredUsers.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
                  <PersonIcon sx={{ fontSize: 34, color: "#d8cef0", mb: 1 }} />
                  <Typography variant="body2" sx={{ color: "#c0b8d4", fontSize: "0.78rem" }}>
                    No users found
                  </Typography>
                </Box>
              ) : (
                filteredUsers.map((user, idx) => {
                  const active = selectedUser?.Id === user.Id;
                  const col    = getColor(idx);
                  return (
                    <Tooltip key={user.Id} title={user.Email} placement="right" arrow>
                      <Box
                        onClick={() => handleSelect(user)}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1.5,
                          px: 2, py: 1.5, cursor: "pointer",
                          borderLeft: active ? "3px solid #667eea" : "3px solid transparent",
                          bgcolor: active ? "#f2eeff" : "transparent",
                          borderBottom: "1px solid #f5f1fd",
                          transition: "all 0.15s ease",
                          "&:hover": { bgcolor: active ? "#f2eeff" : "#faf8fe", borderLeftColor: "#667eea" },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 38, height: 38, bgcolor: col,
                            fontSize: "0.72rem", fontWeight: 700,
                            borderRadius: "10px", flexShrink: 0,
                            boxShadow: active ? `0 2px 10px ${col}55` : "none",
                          }}
                        >
                          {getInitials(user.Email)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: active ? 600 : 400,
                              color: active ? "#667eea" : "#2d2d3a",
                              fontSize: "0.81rem",
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}
                          >
                            {user.Email}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#b0a8c8", fontSize: "0.68rem" }}>
                            ID #{user.Id}
                          </Typography>
                        </Box>
                        {active && (
                          <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: G, flexShrink: 0 }} />
                        )}
                      </Box>
                    </Tooltip>
                  );
                })
              )}
            </Box>

            {/* Sidebar footer */}
            {!usersLoading && (
              <Box sx={{ px: 2, py: 1.2, borderTop: "1px solid #f2edfb", bgcolor: "#faf7fe", flexShrink: 0 }}>
                <Typography variant="caption" sx={{ color: "#b0a8c8", fontSize: "0.69rem" }}>
                  <Box component="span" sx={{ color: "#764ba2", fontWeight: 700 }}>
                    {filteredUsers.length}
                  </Box>{" "}
                  {search ? `of ${users.length} ` : ""}user{filteredUsers.length !== 1 ? "s" : ""}
                </Typography>
              </Box>
            )}
    </>
  )
}
export default UserList 
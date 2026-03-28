"use client";

import { getUserData } from "@/Action/ShowUser";
import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
  Fade,
  Tooltip,
  Collapse,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import InboxIcon from "@mui/icons-material/Inbox";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import { ShowUserInterface } from "@/Interface/ShowUser";
import { ShowEmail } from "@/Interface/ShowEmail";
import { getAssignedEmails } from "@/Action/ShowAssignEmail";
import { getRemark } from "@/Action/SendRemakr";
import UserList from "./UserList";

// ─── Theme constants ───────────────────────────────
const G  = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
const GL = "linear-gradient(135deg, #667eea18 0%, #764ba218 100%)";

const AVATAR_COLORS = [
  "#667eea", "#764ba2", "#f093fb",
  "#4facfe", "#43e97b", "#fa709a",
];

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;                
  }
};   

function getInitials(email: string): string {
  const local = email.split("@")[0];
  const parts = local.split(/[._\-+]/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}

function getColor(i: number) {
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}

// ─── Main Component ───────────────────────────────────────────────────────────
const User = () => {
  const [users, setUsers]           = useState<ShowUserInterface[]>([]);
  const [usersLoading, setUL]       = useState(true);
  const [selectedUser, setSelected] = useState<ShowUserInterface | null>(null);
  const [emails, setEmails]         = useState<ShowEmail[]>([]);
  const [emailsLoading, setEL]      = useState(false);
  const [search, setSearch]         = useState("");
  const [remarkMap, setRemarkMap]   = useState<{ [key: number]: Array<{ remark?: string; CreatedAt?: string }> }>({});
  const [expandedEmailId, setExpandedEmailId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getUserData();
        if (res?.status === "success") setUsers(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setUL(false);
      }
    })();
  }, []);



  const handleSelect = async (user: ShowUserInterface) => {
    setSelected(user);
    setEmails([]);
    setExpandedEmailId(null);
    setEL(true);
    try {
      const res = await getAssignedEmails(user.Id);
      if (res?.status === "success") setEmails(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setEL(false);
    }
  };
const readCount = emails.filter(e => e.isRead === true).length;
const unreadCount = emails.filter(e => e.isRead === false).length;

  const handleSelectEmail = async (email: ShowEmail) => {
    if (expandedEmailId === Number(email.Id)) {
      setExpandedEmailId(null);
      return;
    }

    setExpandedEmailId(Number(email.Id));

    if (!remarkMap[Number(email.Id)]) {
      try {
        const response = await getRemark({ emailId: Number(email.Id) });
        if (response?.success) {
          setRemarkMap((prev) => ({
            ...prev,
            [Number(email.Id)]: response.data,
          }));
        }
      } catch (error) {
        console.error("Remark fetch error:", error);
      }
    }
  };

  useEffect(() => {
  const fetchRemarks = async () => {
    if (emails.length === 0) return;

    const newMap: typeof remarkMap = {};

    for (const email of emails) {
      try {
        const res = await getRemark({ emailId: Number(email.Id) });
        if (res?.success) {
          newMap[Number(email.Id)] = res.data;
        } 
      } catch (e) {
        console.error(e);
      }
    }

    setRemarkMap(newMap);
  };

  fetchRemarks();
}, [emails]);


  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.Email.toLowerCase().includes(q) || String(u.Id).includes(q)
    );
  }, [users, search]);

  const remarkEmailCount = Object.values(remarkMap || {}).filter(
  (remarks) =>
    Array.isArray(remarks) &&
    remarks.some((r) => r?.remark && r.remark.trim() !== "")
).length;

  return (
    <>
      <br />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f7f5fc" }}>

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <Box
          sx={{
            background: G,
            px: 3, py: 2.4,
            display: "flex", alignItems: "center", gap: 2,
            flexShrink: 0,
            boxShadow: "0 4px 24px rgba(102,126,234,0.38)",
            zIndex: 10,
          }} 
        >
          <Box
            sx={{
              width: 44, height: 44, borderRadius: 2.2,
              bgcolor: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.26)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <GroupIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.2px" }}>
              User Management
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {usersLoading ? "Loading…" : `${users.length} registered users`}
            </Typography>
          </Box>
        </Box>

        {/* ══ BODY ══════════════════════════════════════════════════════════ */}
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
          <Box
            sx={{
              width: 292, minWidth: 292,
              bgcolor: "#fff",
              borderRight: "1px solid #ede8f8",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Sidebar top */}
            <Box sx={{ px: 2, pt: 2, pb: 1.5, borderBottom: "1px solid #f2edfb", flexShrink: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700, color: "#764ba2",
                  letterSpacing: "1.6px", textTransform: "uppercase",
                  fontSize: "0.65rem", display: "block", mb: 1.2,
                }}
              >
                All Users
              </Typography>

              <TextField
                fullWidth size="small"
                placeholder="Search by email or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16, color: "#764ba2" }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        onClick={() => setSearch("")}
                        sx={{ fontSize: 15, color: "#c0b0dc", cursor: "pointer", "&:hover": { color: "#764ba2" } }}
                      />
                    </InputAdornment>
                  ) : undefined,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2, fontSize: "0.81rem",
                    "& fieldset": { borderColor: "#e4d9f7" },
                    "&:hover fieldset": { borderColor: "#764ba2" },
                    "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 },
                  },
                }}
              />
            </Box>

           <UserList getInitials={getInitials} usersLoading={usersLoading} filteredUsers={filteredUsers} search={search}  selectedUser={selectedUser} getColor={getColor} handleSelect={handleSelect} users={users} />
          </Box>

          {/* ── RIGHT: EMAIL PANEL ───────────────────────────────────────── */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* No user selected */}
            {!selectedUser && (
              <Fade in> 
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, p: 4 }}>
                  <Box
                    sx={{
                      width: 80, height: 80, borderRadius: 4,
                      background: GL, border: "1.5px solid #d8cef5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <InboxIcon sx={{ fontSize: 36, color: "#764ba2", opacity: 0.55 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#764ba2", opacity: 0.65 }}>
                    Select a User
                  </Typography>
                </Box>
              </Fade>
            )}

            {/* User selected */}
            {selectedUser && (
              <Fade in key={selectedUser.Id}>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                  {/* Panel header */}
                  <Box
                    sx={{
                      px: 3, py: 2.2, bgcolor: "#fff",
                      borderBottom: "1px solid #ede8f8", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 44, height: 44, background: G,
                          fontSize: "0.8rem", fontWeight: 700, borderRadius: "12px",
                          boxShadow: "0 3px 14px rgba(102,126,234,0.38)",
                        }}
                      >
                        {getInitials(selectedUser.Email)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e1e2e", fontSize: "0.9rem", lineHeight: 1.3 }}>
                          {selectedUser.Email}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#b0a8c8", fontSize: "0.7rem" }}>
                          User ID #{selectedUser.Id}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={<EmailIcon sx={{ fontSize: "14px !important", color: "#667eea !important" }} />}
                      label={`${emailsLoading ? "…" : emails.length} Emails`}
                      size="small"
                      sx={{
                        bgcolor: "#f0edfc", color: "#667eea",
                        fontWeight: 600, fontSize: "0.72rem",
                        border: "1px solid #d0c8f5", height: 26,
                      }}
                             
                    />
                    <Chip
                      icon={<EmailIcon sx={{ fontSize: "14px !important", color: "#667eea !important" }} />}
                      label={`${emailsLoading ? "…" : remarkEmailCount} Remarked Emails`}
                      size="small"
                      sx={{
                        bgcolor: "#f0edfc", color: "#667eea",
                        fontWeight: 600, fontSize: "0.72rem",
                        border: "1px solid #d0c8f5", height: 26,
                      }}
                      
                    />
                    <Chip
                      icon={<EmailIcon sx={{ fontSize: "14px !important", color: "#667eea !important" }} />}
                      label={`${emailsLoading ? "…" : unreadCount} Pending Email`}
                      size="small"
                      sx={{
                        bgcolor: "#f0edfc", color: "#667eea",
                        fontWeight: 600, fontSize: "0.72rem",
                        border: "1px solid #d0c8f5", height: 26,
                      }}
                      
                    />
                    <Chip
                      icon={<EmailIcon sx={{ fontSize: "14px !important", color: "#667eea !important" }} />}
                      label={`${emailsLoading ? "…" : readCount} Read Emails`}
                      size="small"
                      sx={{
                        bgcolor: "#f0edfc", color: "#667eea",
                        fontWeight: 600, fontSize: "0.72rem",
                        border: "1px solid #d0c8f5", height: 26,
                      }}
                      
                    />
                  </Box>

                  {/* Email list */}
                  <Box
                    sx={{
                      flex: 1, overflowY: "auto", bgcolor: "#faf8fe",
                      "&::-webkit-scrollbar": { width: 4 },
                      "&::-webkit-scrollbar-thumb": { bgcolor: "#e0d8f5", borderRadius: 4 },
                    }}
                  >
                    {emailsLoading ? (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
                        <Typography variant="caption" sx={{ color: "#b0a8c8" }}>Loading emails…</Typography>
                      </Box>
                    ) : emails.length === 0 ? (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 1.5, p: 4 }}>
                        <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: "#ede9fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <InboxIcon sx={{ fontSize: 26, color: "#764ba2", opacity: 0.45 }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#764ba2", opacity: 0.55 }}>
                          No Emails Assigned
                        </Typography>
                      </Box>
                    ) : (
                      emails.map((email, idx) => (
                        <Fade in key={email.Id} style={{ transitionDelay: `${idx * 25}ms` }}>
                           
                    <Box sx={{ borderBottom: "1px solid #f0ebfc", bgcolor: remarkMap[Number(email.Id)]?.[0]?.remark == null? "#fff" : "#ffe6e6" , "&:last-child": { borderBottom: "none" } }}>  
                            {/* Email Row */}
                            <Box
                              onClick={() => handleSelectEmail(email)}
                              sx={{
                                display: "flex", alignItems: "flex-start", gap: 1.5,
                                px: 2.5, py: 2.2, cursor: "pointer",
                                transition: "background 0.13s",
                                "&:hover": { bgcolor: "#f5f1fe" },
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 36, height: 36, bgcolor: getColor(idx),
                                  fontSize: "0.68rem", fontWeight: 700,
                                  borderRadius: "9px", flexShrink: 0, mt: 0.2,
                                }}
                              >
                                {email.Fromemail?.slice(0, 2).toUpperCase() ?? "EM"}
                              </Avatar>

                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.4 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600, color: "#1e1e2e", fontSize: "0.84rem",
                                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "68%",
                                    }}
                                  >
                                    {email.Subject}
                                  </Typography>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                                    <AccessTimeIcon sx={{ fontSize: 10, color: "#c0b8d4" }} />
                                    <Typography variant="caption" sx={{ color: "#c0b8d4", fontSize: "0.67rem" }}>
                                      {formatDate(email.RecivedDate)}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography variant="caption" sx={{ color: "#9a90b8", fontSize: "0.72rem", display: "block", mb: 0.4 }}>
                                  From: {email.Fromemail}
                                </Typography>
                                {email.Body && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#c0b8d0", fontSize: "0.71rem",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {email.Body}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <br />
                         
                            {/* Remarks Collapse */}
                            <Collapse in={expandedEmailId === Number(email.Id)} timeout={200} unmountOnExit>
                              <Box sx={{ mx: 2.5, mb: 1.5, p: 1.5, bgcolor: "#f5f0ff", borderRadius: 2, border: "1px solid #e4d8f8" }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#764ba2", fontSize: "0.68rem", letterSpacing: "0.8px", textTransform: "uppercase" }}>
                                  💬 Remarks
                                </Typography>

                                {!remarkMap[Number(email.Id)] ? (
                                  <Typography variant="caption" sx={{ color: "#b0a8c8", display: "block", mt: 0.8 }}>
                                    Loading...
                                  </Typography>
                                ) : remarkMap[Number(email.Id)].length === 0 ? (
                                  <Typography variant="caption" sx={{ color: "#b0a8c8", display: "block", mt: 0.8 }}>
                                    No remarks yet.
                                  </Typography>
                                ) : (
                                  remarkMap[Number(email.Id)].map((r, i) => (
                                    <Box key={i} sx={{ mt: 1, pl: 1, borderLeft: "2px solid #c4b5f4" }}>
                                      <Typography variant="caption" sx={{ color: "#4a4262", fontSize: "0.75rem", display: "block" }}>
                                        {r.remark}
                                      </Typography>
                                      {r.CreatedAt && (
                                        <Typography variant="caption" sx={{ color: "#b0a8c8", fontSize: "0.63rem" }}>
                                          {formatDate(r.CreatedAt)}
                                        </Typography>
                                      )}
                                    </Box>
                                  ))
                                )}
                              </Box>
                            </Collapse>

                          </Box>
                        </Fade>
                      ))
                    )}
                  </Box>

                  {/* Panel footer */}
                  {!emailsLoading && emails.length > 0 && (
                    <Box
                      sx={{
                        px: 2.5, py: 1.3,
                        borderTop: "1px solid #ede8f8",
                        bgcolor: "#fff", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#b0a8c8", fontSize: "0.71rem" }}>
                        <Box component="span" sx={{ color: "#667eea", fontWeight: 700 }}>
                          {emails.length}
                        </Box>{" "}
                        email{emails.length !== 1 ? "s" : ""} assigned
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: G, boxShadow: "0 0 0 3px rgba(102,126,234,0.18)" }} />
                        <Typography variant="caption" sx={{ color: "#b0a8c8", fontSize: "0.69rem" }}>Live</Typography>
                      </Box>
                    </Box>
                  )}

                </Box>
              </Fade>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default User; 
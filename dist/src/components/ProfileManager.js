"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const Add_1 = __importDefault(require("@mui/icons-material/Add"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port || 3000}/api`;
const ProfileManager = ({ onSelectProfile, selectedProfileId, }) => {
    const [profiles, setProfiles] = (0, react_1.useState)([]);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [newProfileName, setNewProfileName] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        fetchProfiles();
    }, []);
    const fetchProfiles = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/profiles`);
            if (!response.ok) {
                throw new Error('Failed to fetch profiles');
            }
            const data = await response.json();
            setProfiles(data);
        }
        catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };
    const handleCreateProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/profiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newProfileName }),
            });
            if (!response.ok) {
                throw new Error('Failed to create profile');
            }
            const newProfile = await response.json();
            setProfiles([...profiles, newProfile]);
            setOpen(false);
            setNewProfileName('');
        }
        catch (error) {
            console.error('Error creating profile:', error);
        }
    };
    const handleDeleteProfile = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete profile');
            }
            setProfiles(profiles.filter(profile => profile.id !== id));
            if (selectedProfileId === id) {
                onSelectProfile(null);
            }
        }
        catch (error) {
            console.error('Error deleting profile:', error);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: { p: 2, mb: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Profiles" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", startIcon: (0, jsx_runtime_1.jsx)(Add_1.default, {}), onClick: () => setOpen(true), children: "New Profile" })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: profiles.map((profile) => ((0, jsx_runtime_1.jsx)(material_1.ListItem, { disablePadding: true, secondaryAction: (0, jsx_runtime_1.jsx)(material_1.IconButton, { edge: "end", "aria-label": "delete", onClick: () => handleDeleteProfile(profile.id), color: "error", children: (0, jsx_runtime_1.jsx)(Delete_1.default, {}) }), children: (0, jsx_runtime_1.jsx)(material_1.ListItemButton, { selected: selectedProfileId === profile.id, onClick: () => onSelectProfile(profile.id), children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: profile.name }) }) }, profile.id))) })] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: open, onClose: () => setOpen(false), children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Create New Profile" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { autoFocus: true, margin: "dense", label: "Profile Name", fullWidth: true, value: newProfileName, onChange: (e) => setNewProfileName(e.target.value) }) }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setOpen(false), children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleCreateProfile, variant: "contained", children: "Create" })] })] })] }));
};
exports.default = ProfileManager;

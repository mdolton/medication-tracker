"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const MedicationForm_1 = __importDefault(require("./components/MedicationForm"));
const MedicationList_1 = __importDefault(require("./components/MedicationList"));
const config_1 = require("./config");
const App = () => {
    const [medications, setMedications] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [profileId, setProfileId] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${config_1.API_BASE_URL}/profiles`);
                const profiles = await response.json();
                if (profiles.length > 0) {
                    setProfileId(profiles[0].id);
                }
                else {
                    // Create a default profile if none exists
                    const createResponse = await fetch(`${config_1.API_BASE_URL}/profiles`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: 'Default Profile' })
                    });
                    const newProfile = await createResponse.json();
                    setProfileId(newProfile.id);
                }
            }
            catch (err) {
                setError('Failed to fetch profile');
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, []);
    (0, react_1.useEffect)(() => {
        if (profileId) {
            fetchMedications();
        }
    }, [profileId]);
    const fetchMedications = async () => {
        if (!profileId)
            return;
        setIsLoading(true);
        try {
            const response = await fetch(`${config_1.API_BASE_URL}/profiles/${profileId}/medications`);
            const data = await response.json();
            setMedications(data);
        }
        catch (err) {
            setError('Failed to fetch medications');
            console.error('Error fetching medications:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleAddMedication = async (medication) => {
        if (!profileId)
            return;
        setIsLoading(true);
        try {
            const response = await fetch(`${config_1.API_BASE_URL}/profiles/${profileId}/medications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(medication)
            });
            const newMedication = await response.json();
            setMedications(prev => [...prev, newMedication]);
        }
        catch (err) {
            setError('Failed to add medication');
            console.error('Error adding medication:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDeleteMedication = async (id) => {
        setIsLoading(true);
        try {
            await fetch(`${config_1.API_BASE_URL}/medications/${id}`, {
                method: 'DELETE'
            });
            setMedications(prev => prev.filter(m => m.id !== id));
        }
        catch (err) {
            setError('Failed to delete medication');
            console.error('Error deleting medication:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCheckInteractions = async (medications) => {
        if (!profileId)
            return '';
        setIsLoading(true);
        try {
            const response = await fetch(`${config_1.API_BASE_URL}/check-interactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medications, profileId })
            });
            const data = await response.json();
            return data.analysis;
        }
        catch (err) {
            setError('Failed to check interactions');
            console.error('Error checking interactions:', err);
            return '';
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(material_1.Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) }));
    }
    return ((0, jsx_runtime_1.jsx)(material_1.Container, { maxWidth: "md", children: (0, jsx_runtime_1.jsxs)(material_1.Box, { my: 4, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", component: "h1", gutterBottom: true, children: "Medication Tracker" }), error && ((0, jsx_runtime_1.jsx)(material_1.Typography, { color: "error", gutterBottom: true, children: error })), (0, jsx_runtime_1.jsx)(MedicationForm_1.default, { onSubmit: handleAddMedication }), (0, jsx_runtime_1.jsx)(material_1.Box, { mt: 4, children: (0, jsx_runtime_1.jsx)(MedicationList_1.default, { medications: medications, onDelete: handleDeleteMedication, onCheckInteractions: handleCheckInteractions, profileId: profileId || 0 }) })] }) }));
};
exports.default = App;

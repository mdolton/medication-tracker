"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const react_markdown_1 = __importDefault(require("react-markdown"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
const MedicationList = ({ medications, onDelete, onCheckInteractions, profileId, }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [analysis, setAnalysis] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    // Clear analysis when medications change
    (0, react_1.useEffect)(() => {
        setAnalysis(null);
    }, [medications]);
    (0, react_1.useEffect)(() => {
        const fetchLatestAnalysis = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/latest-analysis`);
                if (response.ok) {
                    const data = await response.json();
                    setAnalysis(data.analysis);
                }
            }
            catch (err) {
                console.error('Error fetching latest analysis:', err);
            }
        };
        fetchLatestAnalysis();
    }, [profileId]);
    const handleCheckInteractions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await onCheckInteractions(medications);
            setAnalysis(result);
        }
        catch (err) {
            setError('Failed to check interactions. Please try again.');
            console.error('Error checking interactions:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const processAnalysis = (text) => {
        if (!text)
            return null;
        // Remove the first paragraph (usually the introduction)
        const paragraphs = text.split('\n\n');
        const relevantContent = paragraphs.slice(1).join('\n\n');
        return relevantContent;
    };
    // Custom components for markdown rendering
    const components = {
        table: ({ children }) => ((0, jsx_runtime_1.jsx)(material_1.TableContainer, { component: material_1.Paper, sx: { mb: 2, mt: 2 }, children: (0, jsx_runtime_1.jsx)(material_1.Table, { size: "small", children: children }) })),
        thead: ({ children }) => ((0, jsx_runtime_1.jsx)(material_1.TableHead, { children: children })),
        tbody: ({ children }) => ((0, jsx_runtime_1.jsx)(material_1.TableBody, { children: children })),
        tr: ({ children }) => ((0, jsx_runtime_1.jsx)(material_1.TableRow, { children: children })),
        th: ({ children }) => ((0, jsx_runtime_1.jsx)(material_1.TableCell, { component: "th", sx: { fontWeight: 'bold', whiteSpace: 'nowrap' }, children: children })),
        td: ({ children }) => ((0, jsx_runtime_1.jsx)(material_1.TableCell, { sx: { whiteSpace: 'normal' }, children: children })),
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: { p: 2, mb: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Medications" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", onClick: handleCheckInteractions, disabled: isLoading || medications.length === 0, startIcon: isLoading ? (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 20, color: "inherit" }) : null, children: isLoading ? 'Checking...' : 'Check Interactions' })] }), medications.length === 0 ? ((0, jsx_runtime_1.jsx)(material_1.Typography, { color: "text.secondary", sx: { textAlign: 'center', py: 2 }, children: "No medications added yet" })) : ((0, jsx_runtime_1.jsx)(material_1.List, { children: medications.map((medication, index) => ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.ListItem, { secondaryAction: (0, jsx_runtime_1.jsx)(material_1.IconButton, { edge: "end", "aria-label": "delete", onClick: () => onDelete(medication.id || 0), children: (0, jsx_runtime_1.jsx)(Delete_1.default, {}) }), children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: medication.name, secondary: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { component: "span", variant: "body2", color: "text.primary", children: ["Dosage: ", medication.dosage] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.Typography, { component: "span", variant: "body2", color: "text.primary", children: ["Frequency: ", medication.frequency] }), medication.notes && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(material_1.Typography, { component: "span", variant: "body2", color: "text.secondary", children: ["Notes: ", medication.notes] })] }))] }) }) }), index < medications.length - 1 && (0, jsx_runtime_1.jsx)(material_1.Divider, {})] }, medication.id || index))) }))] }), error && ((0, jsx_runtime_1.jsx)(material_1.Typography, { color: "error", variant: "body2", sx: { mb: 2 }, children: error })), analysis && ((0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: { p: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Interaction Analysis" }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { '& p': { mb: 1 } }, children: (0, jsx_runtime_1.jsx)(react_markdown_1.default, { remarkPlugins: [remark_gfm_1.default], components: components, children: processAnalysis(analysis) }) })] }))] }));
};
exports.default = MedicationList;

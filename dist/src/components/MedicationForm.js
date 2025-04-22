"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const MedicationForm = ({ onSubmit }) => {
    const [name, setName] = (0, react_1.useState)('');
    const [dosage, setDosage] = (0, react_1.useState)('');
    const [frequency, setFrequency] = (0, react_1.useState)('');
    const [startDate, setStartDate] = (0, react_1.useState)('');
    const [notes, setNotes] = (0, react_1.useState)('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            dosage,
            frequency,
            startDate,
            notes
        });
        setName('');
        setDosage('');
        setFrequency('');
        setStartDate('');
        setNotes('');
    };
    return ((0, jsx_runtime_1.jsx)(material_1.Box, { component: "form", onSubmit: handleSubmit, sx: { mt: 2 }, children: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Box, { sx: { flex: '1 1 calc(50% - 8px)', minWidth: '200px' }, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: "Medication Name", value: name, onChange: (e) => setName(e.target.value), required: true }) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { flex: '1 1 calc(50% - 8px)', minWidth: '200px' }, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: "Dosage", value: dosage, onChange: (e) => setDosage(e.target.value), required: true }) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { flex: '1 1 calc(50% - 8px)', minWidth: '200px' }, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: "Frequency", value: frequency, onChange: (e) => setFrequency(e.target.value), required: true }) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { flex: '1 1 calc(50% - 8px)', minWidth: '200px' }, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: "Start Date", type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), required: true, InputLabelProps: {
                            shrink: true,
                        } }) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { flex: '1 1 100%' }, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: "Notes", value: notes, onChange: (e) => setNotes(e.target.value), multiline: true, rows: 2 }) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { flex: '1 1 100%', mt: 2 }, children: (0, jsx_runtime_1.jsx)(material_1.Button, { type: "submit", variant: "contained", color: "primary", children: "Add Medication" }) })] }) }));
};
exports.default = MedicationForm;

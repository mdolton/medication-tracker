"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const marked_1 = require("marked");
const dompurify_1 = __importDefault(require("dompurify"));
const InteractionAnalysis = ({ analysis }) => {
    // Configure marked to use GitHub-flavored markdown
    marked_1.marked.setOptions({
        gfm: true,
        breaks: true,
    });
    // Remove the first paragraph (everything before the first double newline)
    const contentWithoutFirstParagraph = analysis.split('\n\n').slice(1).join('\n\n');
    // Convert markdown to HTML and sanitize it
    const parser = new marked_1.marked.Parser();
    const tokens = marked_1.marked.lexer(contentWithoutFirstParagraph);
    const htmlContent = dompurify_1.default.sanitize(parser.parse(tokens));
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", gutterBottom: true, children: "Interaction Analysis" }), (0, jsx_runtime_1.jsx)(material_1.Paper, { elevation: 0, sx: {
                    p: 3,
                    bgcolor: 'background.default',
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                        mt: 2,
                        mb: 1,
                    },
                    '& p': {
                        mb: 1,
                    },
                    '& ul, & ol': {
                        pl: 3,
                        mb: 2,
                    },
                    '& li': {
                        mb: 1,
                    },
                    '& strong': {
                        fontWeight: 'bold',
                    },
                    '& em': {
                        fontStyle: 'italic',
                    },
                    '& code': {
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        padding: '0.2em 0.4em',
                        borderRadius: '3px',
                    },
                    '& pre': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        padding: '1em',
                        borderRadius: '4px',
                        overflow: 'auto',
                    },
                    '& blockquote': {
                        borderLeft: '4px solid #dfe2e5',
                        margin: '0 0 16px 0',
                        padding: '0 16px',
                        color: '#6a737d',
                    },
                }, children: (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: htmlContent } }) })] }));
};
exports.default = InteractionAnalysis;

import React from 'react';
import {
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface InteractionAnalysisProps {
  analysis: string;
}

const InteractionAnalysis: React.FC<InteractionAnalysisProps> = ({ analysis }) => {
  // Configure marked to use GitHub-flavored markdown
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // Remove the first paragraph (everything before the first double newline)
  const contentWithoutFirstParagraph = analysis.split('\n\n').slice(1).join('\n\n');

  // Convert markdown to HTML and sanitize it
  const parser = new marked.Parser();
  const tokens = marked.lexer(contentWithoutFirstParagraph);
  const htmlContent = DOMPurify.sanitize(parser.parse(tokens));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Interaction Analysis
      </Typography>
      <Paper
        elevation={0}
        sx={{
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
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Paper>
    </Box>
  );
};

export default InteractionAnalysis; 
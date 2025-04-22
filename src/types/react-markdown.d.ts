declare module 'react-markdown' {
  import { ReactNode } from 'react';

  interface ReactMarkdownProps {
    children: string | null;
    components?: {
      [key: string]: React.ComponentType<any>;
    };
    remarkPlugins?: any[];
  }

  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  export default ReactMarkdown;
} 
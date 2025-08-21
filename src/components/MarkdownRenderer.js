import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './MarkdownRenderer.css';

// Enhanced markdown renderer with direct KaTeX rendering
const MarkdownRenderer = ({ content }) => {
  const renderContent = (text) => {
    let processedText = text;
    
    // Process LaTeX expressions and render them immediately
    // Display math patterns
    processedText = processedText.replace(/\\\[([\s\S]*?)\\\]/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#ff6b6b'
        });
        return `<div class="math-display-wrapper">${rendered}</div>`;
      } catch (error) {
        return `<div class="math-error">LaTeX Error: ${error.message}</div>`;
      }
    });
    
    processedText = processedText.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#ff6b6b'
        });
        return `<div class="math-display-wrapper">${rendered}</div>`;
      } catch (error) {
        return `<div class="math-error">LaTeX Error: ${error.message}</div>`;
      }
    });
    
    // Inline math patterns
    processedText = processedText.replace(/\\\((.*?)\\\)/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
          errorColor: '#ff6b6b'
        });
        return `<span class="math-inline-wrapper">${rendered}</span>`;
      } catch (error) {
        return `<span class="math-error">LaTeX Error: ${error.message}</span>`;
      }
    });
    
    processedText = processedText.replace(/\$([^$\n\r]+?)\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
          errorColor: '#ff6b6b'
        });
        return `<span class="math-inline-wrapper">${rendered}</span>`;
      } catch (error) {
        return `<span class="math-error">LaTeX Error: ${error.message}</span>`;
      }
    });
    
    // Apply other markdown formatting
    processedText = processedText
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="markdown-strong">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="markdown-strong">$1</strong>')
      // Italic text
      .replace(/\*([^*]+?)\*/g, '<em class="markdown-em">$1</em>')
      .replace(/\b_([^_]+?)_\b/g, '<em class="markdown-em">$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="markdown-h3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="markdown-h2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="markdown-h1">$1</h1>')
      // Line breaks
      .replace(/\n/g, '<br>');

    return processedText;
  };

  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: renderContent(content) }}
    />
  );
};

export default MarkdownRenderer;

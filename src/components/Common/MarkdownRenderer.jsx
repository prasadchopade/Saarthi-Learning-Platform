import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content, className = "" }) => {
  if (!content) {
    return (
      <div className={`prose dark:text-white dark:prose-invert max-w-none ${className}`}>
        <p className="text-gray-500 dark:text-gray-400 italic">No content available</p>
      </div>
    );
  }

  if(content.startsWith('```markdown')) {
    content = content.replace('```markdown', '').replace(/```\s*$/g, '');
  } else if(content.startsWith('```') && content.trim().endsWith('```')) {
    const firstLineEnd = content.indexOf('\n');
    
    if (firstLineEnd !== -1) {
      const firstLine = content.substring(0, firstLineEnd);
      
      if (firstLine.startsWith('```') && firstLine.length > 3) {
        // Has a language specifier like ```python, ```js, etc.
        content = content.substring(firstLineEnd + 1).replace(/```\s*$/g, '');
      } else {
        // Just starts with ``` without language specifier
        content = content.replace(/^```/, '').replace(/```\s*$/g, '');
      }
    } else {
      // Single line content - just remove the backticks
      content = content.replace(/^```/, '').replace(/```\s*$/g, '');
    }
  }
  return (
    <div className={`prose dark:text-white dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-pre:p-0 ${className}`}>
      <ReactMarkdown
        components={{
          h1({node, children, ...props}) {
            return (
              <>
                <br />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6" {...props}>
                  {children}
                </h1>
                <br />
              </>
            );
          },
          h2({node, children, ...props}) {
            return (
              <>
                <br />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-5" {...props}>
                  {children}
                </h2>
                <br />
              </>
            );
          },
          h3({node, children, ...props}) {
            return (
              <>
                <br />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 mt-4" {...props}>
                  {children}
                </h3>
                <br />
              </>
            );
          },
          h4({node, children, ...props}) {
            return (
              <>
                <br />
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2 mt-3" {...props}>
                  {children}
                </h4>
                <br />
              </>
            );
          },
          p({node, children, ...props}) {
            return (
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
          ul({node, children, ...props}) {
            return (
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 mb-4 space-y-2" {...props}>
                {children}
              </ul>
            );
          },
          ol({node, children, ...props}) {
            return (
              <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300 mb-4 space-y-2" {...props}>
                {children}
              </ol>
            );
          },
          li({node, children, ...props}) {
            return (
              <li className="text-gray-700 dark:text-gray-300 leading-relaxed ml-1" {...props}>
                {children}
              </li>
            );
          },
          strong({node, children, ...props}) {
            return (
              <strong className="font-bold text-gray-900 dark:text-white" {...props}>
                {children}
              </strong>
            );
          },
          em({node, children, ...props}) {
            return (
              <em className="italic text-gray-800 dark:text-gray-200" {...props}>
                {children}
              </em>
            );
          },
          blockquote({node, children, ...props}) {
            return (
              <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800/50 italic text-gray-700 dark:text-gray-300" {...props}>
                {children}
              </blockquote>
            );
          },
          a({node, href, children, ...props}) {
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors duration-200"
                {...props}
              >
                {children}
              </a>
            );
          },
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-4">
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          pre({node, children, ...props}) {
            return (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4" {...props}>
                {children}
              </pre>
            );
          },
          hr({node, ...props}) {
            return (
              <hr className="my-8 border-gray-300 dark:border-gray-600" {...props} />
            );
          },
          table({node, children, ...props}) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({node, children, ...props}) {
            return (
              <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-left font-bold text-gray-900 dark:text-white" {...props}>
                {children}
              </th>
            );
          },
          td({node, children, ...props}) {
            return (
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300" {...props}>
                {children}
              </td>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

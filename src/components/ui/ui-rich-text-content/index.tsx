'use client'
import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import './index.scss';

const RichTextContent = ({ content, className = '' }: { content: string, className?: string }) => {
  useEffect(() => {
    if (typeof document != "undefined") {
      const container = document.querySelector('.ui-rich-text-content');
      if (container) {
        const tables = container.querySelectorAll('table');
        tables.forEach((table) => {
          const outerWrapper = document.createElement('div');
          outerWrapper.className = 'm-scrollbar';
          const innerWrapper = document.createElement('div');
          innerWrapper.className = 'm-scrollbar__container';

          table.parentNode?.insertBefore(outerWrapper, table);
          outerWrapper.appendChild(innerWrapper);
          innerWrapper.appendChild(table);
        });
      }
    }
  }, [content]);

  return (
    <div className={cn('ui-rich-text-content', className)} dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default RichTextContent;
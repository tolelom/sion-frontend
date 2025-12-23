import React, { forwardRef } from 'react';
import '../../styles/Chat.css';

const CommentaryPanel = forwardRef(({ commentaries }, ref) => {
  return (
    <div className="commentary-panel" ref={ref}>
      {commentaries.map((item) => (
        <div key={item.id} className={`commentary-item ${item.type}`}>
          {item.text}
        </div>
      ))}
    </div>
  );
});

CommentaryPanel.displayName = 'CommentaryPanel';

export default CommentaryPanel;

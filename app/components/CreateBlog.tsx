'use client';
import React, { useState } from 'react';
import TextEditor from './textEditor/TextEditor';
import SaveDraftDialog from './SaveDraftDialog';

const CreateBlog = () => {
  const [blogContent, setBlogContent] = useState('');

  function onUpdate(content: string) {
    setBlogContent(content);
  }

  return (
    <>
      <TextEditor onUpdate={onUpdate} />
      <SaveDraftDialog blogContent={blogContent} />
    </>
  );
};

export default CreateBlog;

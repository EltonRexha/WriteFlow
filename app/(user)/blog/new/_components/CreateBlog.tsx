'use client';
import React, { useState } from 'react';
import TextEditor from '../../../../components/textEditor/TextEditor';
import CreateDraftDialog from './CreateDraftDialog';
import CreateBlogDialog from './CreateBlogDialog';

const CreateBlog = () => {
  const [blogContent, setBlogContent] = useState('');

  function onUpdate(content: string) {
    setBlogContent(content);
  }

  return (
    <>
      <TextEditor onUpdate={onUpdate} />
      <CreateDraftDialog blogContent={blogContent} />
      <CreateBlogDialog blogContent={blogContent} />
    </>
  );
};

export default CreateBlog;

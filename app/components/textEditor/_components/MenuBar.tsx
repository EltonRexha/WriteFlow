'use client';
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Menu,
  X,
  Upload,
  TextQuote,
  Minus,
  Highlighter,
} from 'lucide-react';
import { isMobile } from 'react-device-detect';
import AnimatedMenu from './AnimatedMenu';
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {!isMenuOpen && (
        <button
          className="md:hidden btn btn-sm btn-circle fixed top-15 left-2 z-10"
          onClick={toggleMenu}
        >
          <Menu height={15} />
        </button>
      )}

      <AnimatedMenu isMenuOpen={isMenuOpen}>
        <div className="flex gap-2 items-center">
          <div className="join">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={` btn btn-sm join-item ${
                editor.isActive({ textAlign: 'left' }) ? 'btn-primary' : ''
              }`}
            >
              <AlignLeft height={15} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={`btn btn-sm join-item ${
                editor.isActive({ textAlign: 'center' }) ? 'btn-primary' : ''
              }`}
            >
              <AlignCenter height={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`btn btn-sm join-item ${
                editor.isActive({ textAlign: 'right' }) ? 'btn-primary' : ''
              }`}
            >
              <AlignRight height={15} />
            </button>
          </div>
          <button
            className="md:hidden"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            <X height={20} color="#ffffff" />
          </button>
        </div>

        <div className="join">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`btn btn-sm join-item ${
              editor.isActive('heading', { level: 1 }) ? 'btn-primary' : ''
            }`}
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`btn btn-sm join-item ${
              editor.isActive('heading', { level: 2 }) ? 'btn-primary' : ''
            }`}
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`btn btn-sm join-item ${
              editor.isActive('heading', { level: 3 }) ? 'btn-primary' : ''
            }`}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`btn btn-sm join-item ${
              editor.isActive('paragraph') ? 'btn-primary' : ''
            }`}
          >
            P
          </button>
        </div>

        <div className="join">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`btn btn-sm join-item ${
              editor.isActive('bold') ? 'btn-primary' : ''
            }`}
          >
            <Bold height={15} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`btn btn-sm join-item ${
              editor.isActive('italic') ? 'btn-primary' : ''
            }`}
          >
            <Italic height={15} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`btn btn-sm join-item ${
              editor.isActive('strike') ? 'btn-primary' : ''
            }`}
          >
            <Strikethrough height={15} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`btn btn-sm join-item ${
              editor.isActive('highlight') ? 'btn-primary' : ''
            }`}
          >
            <Highlighter height={15}/>
          </button>
        </div>

        <div className="join">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`btn btn-sm join-item ${
              editor.isActive('bulletList') ? 'btn-primary' : ''
            }`}
          >
            <List height={15} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`btn btn-sm join-item ${
              editor.isActive('orderedList') ? 'btn-primary' : ''
            }`}
          >
            <ListOrdered height={15} />
          </button>
          <button
            className={`btn btn-sm join-item ${
              editor.isActive('blockquote') ? 'btn-primary' : ''
            }`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <TextQuote height={15} />
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={`btn btn-sm join-item ${
              editor.isActive('horizontal') ? 'btn-primary' : ''
            }`}
          >
            <Minus height={15} />
          </button>
        </div>

        <CldUploadWidget
          uploadPreset="blog_images"
          onSuccess={(result) => {
            const info = result?.info as CloudinaryUploadWidgetInfo;
            const url = info.secure_url;
            console.log(url);
            editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          {({ open }) => (
            <button className="btn btn-sm" onClick={() => open()}>
              <Upload height={15} />
            </button>
          )}
        </CldUploadWidget>

        {!isMobile && (
          <div className="join">
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`btn btn-sm join-item ${
                editor.isActive('codeBlock') ? 'btn-primary' : ''
              }`}
            >
              <Code height={15} />
            </button>
          </div>
        )}
      </AnimatedMenu>
    </>
  );
};

export default MenuBar;

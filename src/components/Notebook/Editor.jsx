import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import './tiptap.css';
import { useTheme } from '../../context/ThemeContext';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list'
import Blockquote from '@tiptap/extension-blockquote'
import {Dropcursor} from '@tiptap/extensions'
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { toast } from 'react-hot-toast';
import notebookService from '../../services/notebookService';
import { exportAsPDF } from './exportUtils';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Undo, Redo, Image as ImageIcon, Link as LinkIcon, Highlighter,
    Quote, ChevronDown, Palette, Video, Table as TableIcon,
    ListChecks, Subscript as SubIcon, Superscript as SupIcon,
    Minus, Eraser, Sun, Moon, ArrowBigLeft, Save, FileDown,
} from 'lucide-react';

const TiptapEditor = ({ setSelectedNotebookId, selectedNotebookId, initialContent = '', onNotesGenerated, placeholder = 'Start typing...' }) => {
    const { darkMode, toggleDarkMode } = useTheme();
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [showVideoInput, setShowVideoInput] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const editor = useEditor({
        extensions: [
        StarterKit,
        BulletList,
        ListItem,
        OrderedList,
        Blockquote,
        Document,
        Paragraph,
        Text,
        Heading.configure({
            levels: [1, 2, 3],
        }),
        Bold,
        Underline,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Highlight.configure({
            multicolor: true,
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-blue-500 underline cursor-pointer',
            },
        }),
        Image,
        Dropcursor,
        TextStyle,
        Color,
        Subscript,
        Superscript,
        Table.configure({
            resizable: true,
            HTMLAttributes: {
                class: 'border-collapse w-full my-4',
            },
        }),
        TableRow,
        TableHeader,
        TableCell,
        Youtube.configure({
            controls: true,
            nocookie: true,
            HTMLAttributes: {
                class: 'w-full aspect-video rounded-lg',
            },
        }),
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        Placeholder.configure({
            placeholder: placeholder,
        }),
        CharacterCount,
      ],
    content: initialContent,
        editorProps: {
    attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none px-8 py-6',
        },
},
    });

// Update content when initialContent prop changes
useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
        editor.commands.setContent(initialContent);
    }
}, [initialContent, editor]);

// Handle onNotesGenerated prop changes
useEffect(() => {
    if (editor && onNotesGenerated) {
        // First add a line break if there's existing content
        if (editor.getHTML() && editor.getHTML() !== '<p></p>') {
            editor.chain().focus().insertContent('<br><br>').run();
        }
        
        // Insert the HTML content directly
        editor.chain().focus().insertContent(onNotesGenerated, {
            parseOptions: {
                preserveWhitespace: false,
            },
        }).run();
    }
}, [onNotesGenerated, editor]);

if (!editor) {
    return null;
}

const insertLink = () => {
    if (linkUrl) {
        editor.chain().focus().setLink({ href: linkUrl }).run();
        setLinkUrl('');
        setShowLinkInput(false);
    }
};

const insertVideo = () => {
    if (videoUrl) {
        editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run();
        setVideoUrl('');
        setShowVideoInput(false);
    }
};

const applyHeading = (level) => {
    if (level === 0) {
        editor.chain().focus().setParagraph().run();
    } else {
        editor.chain().focus().toggleHeading({ level }).run();
    }
    setShowHeadingMenu(false);
};

const applyColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
};

const applyHighlight = (color) => {
    editor.chain().focus().toggleHighlight({ color }).run();
    setShowHighlightPicker(false);
};

// Handle clipboard image paste
const handleClipboardPaste = async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
            event.preventDefault();
            try {
                const file = item.getAsFile();
                const imageUrl = await convertFileToBase64(file);
                
                if (imageUrl) {
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                }
            } catch (error) {
                console.error('Error processing clipboard image:', error);
            }
            break;
        }
    }
};

// Convert file to base64 data URL
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ToolbarButton = ({ icon: Icon, onClick, title, active = false, disabled = false }) => {
    const { darkMode } = useTheme();
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded transition-colors ${
                active 
                    ? darkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white'
                    : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
            title={title}
        >
            <Icon size={18} />
        </button>
    );
};

const Divider = () => {
    const { darkMode } = useTheme();
    return <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} mx-1`} />;
};

const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    return 'Paragraph';
};


const handleSave = async () => {
    try {
      if (!editor || !selectedNotebookId) return;
      
      toast.loading('Saving notebook...');
      setIsSaving(true);
      const content = editor.getHTML();
      const response = await notebookService.saveNotebookContent(selectedNotebookId, content);
      
      toast.success('Notebook saved successfully');
    } catch (error) {
      console.error('Error saving notebook:', error);
      toast.error('Failed to save notebook');
    } finally {
      toast.dismiss();
      setIsSaving(false);
    }
  };
  
  const handleExportPDF = () => {
    try {
      if (!editor) return;
      
      toast.loading('Exporting PDF...');
      const content = editor.getHTML();
      exportAsPDF(content);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };
  
return (
    <div className={`w-full max-w-6xl mx-auto ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-40px)]`}>
        {/* Fixed Toolbar */}
        <div className={`flex-shrink-0 sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
            <div className="flex items-center gap-1 p-2 flex-wrap">
                
                {/* Back Button */}
                <ToolbarButton
                    icon={ArrowBigLeft}
                    onClick={() => setSelectedNotebookId(null)}
                    title="Back to Library"
                />
                
                {/* Save & Export */}
                <ToolbarButton
                    icon={Save}
                    onClick={handleSave}
                    title="Save Notebook"
                    disabled={isSaving}
                />
                
                <ToolbarButton
                    icon={FileDown}
                    onClick={handleExportPDF}
                    title="Export as PDF"
                />
                
                <Divider />
                
                {/* Undo/Redo */}
                <ToolbarButton
                    icon={Undo}
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                />
                <ToolbarButton
                    icon={Redo}
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                />

                <Divider />

                {/* Heading Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded transition-colors`}
                    >
                        <span>{getCurrentHeading()}</span>
                        <ChevronDown size={16} />
                    </button>
                    {showHeadingMenu && (
                        <div className={`absolute top-full left-0 mt-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-10 min-w-[180px]`}>
                            <button onClick={() => applyHeading(0)} className={`block w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'} text-sm`}>
                                Paragraph
                            </button>
                            <button onClick={() => applyHeading(1)} className={`block w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'} text-2xl font-bold`}>
                                Heading 1
                            </button>
                            <button onClick={() => applyHeading(2)} className={`block w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'} text-xl font-bold`}>
                                Heading 2
                            </button>
                            <button onClick={() => applyHeading(3)} className={`block w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'} text-lg font-semibold`}>
                                Heading 3
                            </button>
                        </div>
                    )}
                </div>

                <Divider />

                {/* Text Formatting */}
                <ToolbarButton
                    icon={Bold}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                    active={editor.isActive('bold')}
                />
                <ToolbarButton
                    icon={Italic}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                    active={editor.isActive('italic')}
                />
                <ToolbarButton
                    icon={UnderlineIcon}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                    active={editor.isActive('underline')}
                />
                <ToolbarButton
                    icon={Strikethrough}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                    active={editor.isActive('strike')}
                />
                <ToolbarButton
                    icon={SubIcon}
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    title="Subscript"
                    active={editor.isActive('subscript')}
                />
                <ToolbarButton
                    icon={SupIcon}
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    title="Superscript"
                    active={editor.isActive('superscript')}
                />

                <Divider />

                {/* Color Pickers */}
                <div className="relative">
                    <ToolbarButton
                        icon={Palette}
                        onClick={() => {
                            setShowColorPicker(!showColorPicker);
                            setShowHighlightPicker(false);
                        }}
                        title="Text Color"
                    />
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                            <div className="grid grid-cols-6 gap-2">
                                {['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
                                    '#8b5cf6', '#ec4899', '#6b7280', '#ffffff'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => applyColor(color)}
                                            className="w-7 h-7 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <ToolbarButton
                        icon={Highlighter}
                        onClick={() => {
                            setShowHighlightPicker(!showHighlightPicker);
                            setShowColorPicker(false);
                        }}
                        title="Highlight"
                        active={editor.isActive('highlight')}
                    />
                    {showHighlightPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                            <div className="grid grid-cols-5 gap-2">
                                {['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa',
                                    '#e9d5ff', '#fecaca', '#fde68a', '#d9f99d', '#ccfbf1'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => applyHighlight(color)}
                                            className="w-7 h-7 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                <Divider />

                {/* Lists */}
                <ToolbarButton
                    icon={List}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                    active={editor.isActive('bulletList')}
                />
                <ToolbarButton
                    icon={ListOrdered}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Numbered List"
                    active={editor.isActive('orderedList')}
                />
                <ToolbarButton
                    icon={ListChecks}
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    title="Task List"
                    active={editor.isActive('taskList')}
                />

                <Divider />

                {/* Alignment */}
                <ToolbarButton
                    icon={AlignLeft}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    title="Align Left"
                    active={editor.isActive({ textAlign: 'left' })}
                />
                <ToolbarButton
                    icon={AlignCenter}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    title="Align Center"
                    active={editor.isActive({ textAlign: 'center' })}
                />
                <ToolbarButton
                    icon={AlignRight}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    title="Align Right"
                    active={editor.isActive({ textAlign: 'right' })}
                />
                <ToolbarButton
                    icon={AlignJustify}
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    title="Justify"
                    active={editor.isActive({ textAlign: 'justify' })}
                />

                <Divider />

                {/* Other Formatting */}
                <ToolbarButton
                    icon={Quote}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                    active={editor.isActive('blockquote')}
                />
                <ToolbarButton
                    icon={Code}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    title="Code Block"
                    active={editor.isActive('codeBlock')}
                />
                <ToolbarButton
                    icon={Minus}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                />

                <Divider />

                {/* Insert Media */}
                <div className="relative">
                    <ToolbarButton
                        icon={LinkIcon}
                        onClick={() => setShowLinkInput(!showLinkInput)}
                        title="Insert Link"
                        active={editor.isActive('link')}
                    />
                    {showLinkInput && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3 flex gap-2 min-w-[300px]">
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && insertLink()}
                            />
                            <button
                                onClick={insertLink}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <ToolbarButton
                        icon={Video}
                        onClick={() => setShowVideoInput(!showVideoInput)}
                        title="Insert YouTube Video"
                    />
                    {showVideoInput && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3 flex gap-2 min-w-[300px]">
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="YouTube URL"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && insertVideo()}
                            />
                            <button
                                onClick={insertVideo}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <Divider />

                <ToolbarButton
                    icon={Eraser}
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    title="Clear Formatting"
                />

                {/* Dark Mode Toggle */}
                <ToolbarButton
                    icon={darkMode ? Sun : Moon}
                    onClick={toggleDarkMode}
                    title={darkMode ? "Light Mode" : "Dark Mode"}
                />
            </div>

            {/* Character Count */}
            <div className={`px-4 py-2 text-xs ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-100'} border-t`}>
                {editor.storage.characterCount.characters()} characters · {editor.storage.characterCount.words()} words
            </div>
        </div>

        {/* Editor Content - Scrollable */}
        <div 
            className={`flex-grow overflow-y-auto relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            onPaste={handleClipboardPaste}
        >
            <EditorContent editor={editor} className={`h-full ${darkMode ? 'dark-content' : ''}`} />
        </div>
    </div>
);
  };

export default TiptapEditor;
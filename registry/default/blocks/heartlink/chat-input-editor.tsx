import { useState, useRef, useEffect, useCallback } from'react';
import { Bold, Italic, Strikethrough, Copy, Link } from'lucide-react';

interface ChatInputEditorProps {
 value: string;
 onChange: (value: string) => void;
 onSubmit: () => void;
 placeholder?: string;
 disabled?: boolean;
 maxLength?: number;
}

/**
 * MNC-grade chat input with floating formatting toolbar.
 * 
 * Uses a contentEditable div with the native Selection API instead of 
 * a heavy rich-text framework. This eliminates all runtime initialization 
 * failures and provides a zero-dependency, crash-proof implementation.
 * 
 * The floating toolbar appears on text selection within the editor.
 */
export const ChatInputEditor = ({
 value,
 onChange,
 onSubmit,
 placeholder ='Type a message...',
 disabled = false,
 maxLength = 2000
}: ChatInputEditorProps) => {
 const editorRef = useRef<HTMLDivElement>(null);
 const toolbarRef = useRef<HTMLDivElement>(null);
 const [showToolbar, setShowToolbar] = useState(false);
 const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
 const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
 const isComposingRef = useRef(false);
 const [charCount, setCharCount] = useState(0);
 const sanitizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 // Sync external value clearing (e.g. after submit) or appends (e.g. from emoji picker)
 useEffect(() => {
 if (!editorRef.current) return;
 
 // If value is empty, clear editor completely
 if (value === '') {
   if (editorRef.current.textContent !== '') {
     editorRef.current.innerHTML = '';
     setCharCount(0);
   }
   return;
 }
 
 // If value comes from outside (e.g., emoji picker appended to previous text)
 // and it doesn't match our current HTML, update the editor.
 if (value !== editorRef.current.innerHTML) {
   editorRef.current.innerHTML = value;
   setCharCount(editorRef.current.textContent?.length || 0);
   
   // Move cursor to the end safely
   const selection = window.getSelection();
   if (selection) {
     const range = document.createRange();
     range.selectNodeContents(editorRef.current);
     range.collapse(false);
     selection.removeAllRanges();
     selection.addRange(range);
   }
 }
 }, [value]);

 // Check which formatting is currently active at the selection
 const checkActiveFormats = useCallback(() => {
 const formats = new Set<string>();
 if (document.queryCommandState('bold')) formats.add('bold');
 if (document.queryCommandState('italic')) formats.add('italic');
 if (document.queryCommandState('strikeThrough')) formats.add('strike');
 setActiveFormats(formats);
 }, []);

 // Handle selection changes to show/hide the floating toolbar
 const handleSelectionChange = useCallback(() => {
 const selection = window.getSelection();
 if (
 !selection ||
 selection.isCollapsed ||
 !editorRef.current ||
 !editorRef.current.contains(selection.anchorNode)
 ) {
 setShowToolbar(false);
 return;
 }

 const selectedText = selection.toString().trim();
 if (!selectedText) {
 setShowToolbar(false);
 return;
 }

 const range = selection.getRangeAt(0);
 const rect = range.getBoundingClientRect();
 const editorRect = editorRef.current.getBoundingClientRect();

 // Position the toolbar above the selection, centered
 setToolbarPos({
 top: rect.top - editorRect.top - 44,
 left: rect.left - editorRect.left + rect.width / 2 - 80,
 });

 checkActiveFormats();
 setShowToolbar(true);
 }, [checkActiveFormats]);

 // Attach selection change listener
 useEffect(() => {
 document.addEventListener('selectionchange', handleSelectionChange);
 return () => {
 document.removeEventListener('selectionchange', handleSelectionChange);
 };
 }, [handleSelectionChange]);

 // Cleanup sanitize timer on unmount
 useEffect(() => {
 return () => {
 if (sanitizeTimerRef.current) clearTimeout(sanitizeTimerRef.current);
 };
 }, []);

 // Handle keyboard shortcuts
 const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
 if (e.key ==='Enter'&& !e.shiftKey) {
 e.preventDefault();
 onSubmit();
 return;
 }
 }, [onSubmit]);

 // Handle input changes — lightweight on keystrokes, full sanitize debounced
 const handleInput = useCallback(() => {
 if (isComposingRef.current) return;
 const textLength = editorRef.current?.textContent?.length || 0;
 setCharCount(textLength);
 
 // Truncate if over limit
 if (textLength > maxLength && editorRef.current) {
 const text = editorRef.current.textContent || '';
 editorRef.current.textContent = text.substring(0, maxLength);
 setCharCount(maxLength);
 }
 
 const html = editorRef.current?.innerHTML || '';
 onChange(html);
 
 // Debounced full sanitization (runs 300ms after last keystroke)
 if (sanitizeTimerRef.current) clearTimeout(sanitizeTimerRef.current);
 sanitizeTimerRef.current = setTimeout(() => {
 if (!editorRef.current) return;
 const rawHtml = editorRef.current.innerHTML;
 const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
 const allowedTags = ['B','I','S','U','A','SPAN','DIV','P','BR'];
 const allowedAttrs = ['href','class','target','rel'];
 
 const sanitizeNode = (node: Node) => {
 if (node.nodeType === Node.TEXT_NODE) return;
 if (node.nodeType === Node.ELEMENT_NODE) {
 const el = node as HTMLElement;
 if (!allowedTags.includes(el.tagName)) {
 const text = document.createTextNode(el.textContent || '');
 el.parentNode?.replaceChild(text, el);
 return;
 }
 for (let i = el.attributes.length - 1; i >= 0; i--) {
 const attr = el.attributes[i];
 if (!allowedAttrs.includes(attr.name.toLowerCase())) {
 el.removeAttribute(attr.name);
 } else if (attr.name.toLowerCase() === 'href') {
 const val = attr.value.trim().toLowerCase();
 if (val.startsWith('javascript:') || val.startsWith('data:')) {
 el.removeAttribute(attr.name);
 }
 }
 }
 Array.from(el.childNodes).forEach(sanitizeNode);
 }
 };
 Array.from(doc.body.childNodes).forEach(sanitizeNode);
 const sanitized = doc.body.innerHTML;
 if (sanitized !== rawHtml) {
 editorRef.current.innerHTML = sanitized;
 onChange(sanitized);
 }
 }, 300);
 }, [onChange, maxLength]);

 // Apply formatting command
 const applyFormat = useCallback((command: string) => {
 document.execCommand(command, false);
 editorRef.current?.focus();
 checkActiveFormats();
 }, [checkActiveFormats]);

 // Copy selected text
 const handleCopy = useCallback(() => {
 const selection = window.getSelection();
 if (selection) {
 navigator.clipboard.writeText(selection.toString()).catch(() => {
 document.execCommand('copy');
 });
 }
 }, []);

 // Get link from selection
 const handleLink = useCallback(() => {
 const url = prompt('Enter URL:');
 if (url) {
 const trimmed = url.trim().toLowerCase();
 if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
 document.execCommand('createLink', false, url.trim());
 editorRef.current?.focus();
 }
 }
 }, []);

 const isEmpty = !value || value.trim() ==='';

 return (
 <div className="flex-1 relative">
 {/* Floating Toolbar */}
 {showToolbar && (
 <div
 ref={toolbarRef}
 className="absolute z-50 flex items-center gap-0.5 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-lg p-1 transition-all duration-150"
 style={{
 top: `${toolbarPos.top}px`,
 left: `${Math.max(0, toolbarPos.left)}px`,
 }}
 onMouseDown={(e) => e.preventDefault()} // Prevent blur on toolbar click
 >
 <button
 type="button"
 onClick={() => applyFormat('bold')}
 className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
 activeFormats.has('bold')
 ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
 : 'text-slate-600 dark:text-slate-300'
 }`}
 title="Bold (Ctrl+B)"
 >
 <Bold className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={() => applyFormat('italic')}
 className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
 activeFormats.has('italic')
 ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
 : 'text-slate-600 dark:text-slate-300'
 }`}
 title="Italic (Ctrl+I)"
 >
 <Italic className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={() => applyFormat('strikeThrough')}
 className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
 activeFormats.has('strike')
 ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
 : 'text-slate-600 dark:text-slate-300'
 }`}
 title="Strikethrough"
 >
 <Strikethrough className="w-3.5 h-3.5" />
 </button>
 <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
 <button
 type="button"
 onClick={handleCopy}
 className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300"
 title="Copy"
 >
 <Copy className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={handleLink}
 className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300"
 title="Insert Link"
 >
 <Link className="w-3.5 h-3.5" />
 </button>
 </div>
 )}

 {/* Editor */}
 <div
 ref={editorRef}
 contentEditable={!disabled}
 suppressContentEditableWarning
 role="textbox"
 spellCheck={false}
 aria-label="Message input"
 aria-placeholder={placeholder}
 onInput={handleInput}
 onDrop={(e) => {
 e.preventDefault(); // Prevent dropping massive HTML chunks directly into DOM
 }}
 onKeyDown={handleKeyDown}
 onScroll={() => {
 if (showToolbar) handleSelectionChange();
 }}
 onCompositionStart={() => { isComposingRef.current = true; }}
 onCompositionEnd={() => {
 isComposingRef.current = false;
 handleInput();
 }}
 onPaste={(e) => {
 // Paste as plain text to prevent HTML injection and handle massive payloads safely
 e.preventDefault();
 let text = e.clipboardData.getData('text/plain');
 const currentLength = editorRef.current?.textContent?.length || 0;
 
 if (currentLength + text.length > maxLength) {
 const allowedLength = Math.max(0, maxLength - currentLength);
 text = text.substring(0, allowedLength);
 }
 
 // MNC-Grade: Safely insert text while preserving line breaks as <br> elements
 const selection = window.getSelection();
 if (selection && selection.rangeCount > 0) {
 const range = selection.getRangeAt(0);
 range.deleteContents(); // Remove currently selected text
 
 const lines = text.split('\n');
 const fragment = document.createDocumentFragment();
 
 lines.forEach((line, index) => {
 if (line) {
 fragment.appendChild(document.createTextNode(line));
 }
 if (index < lines.length - 1) {
 fragment.appendChild(document.createElement('br'));
 }
 });
 
 const lastChild = fragment.lastChild;
 range.insertNode(fragment);
 
 // Move cursor to the end of the inserted text
 if (lastChild) {
 range.setStartAfter(lastChild);
 range.setEndAfter(lastChild);
 selection.removeAllRanges();
 selection.addRange(range);
 }
 
 handleInput(); // Trigger input update
 }
 }}
 className={`w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition max-h-36 overflow-y-auto break-words whitespace-pre-wrap ${
 disabled ? 'opacity-50 pointer-events-none' : ''
 }`}
 style={{ minHeight: '36px' }}
 />

 {/* Placeholder overlay */}
 {isEmpty && !disabled && (
 <div
 className="absolute top-1.5 left-3 text-xs sm:text-sm text-slate-400 dark:text-slate-500 pointer-events-none select-none"
 aria-hidden="true"
 >
 {placeholder}
 </div>
 )}
 </div>
 );
};

import { useState, useEffect } from 'react';

export default function ComponentPreview({ code, onCodeChange, shouldBlink }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedElement, setSelectedElement] = useState(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (shouldBlink) {
      setBlink(true);
      const timeout = setTimeout(() => setBlink(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [shouldBlink]);

  const createComponent = (jsxCode, cssCode) => {
    try {
      const className = `component-${Date.now()}`;
      const styleId = `style-${className}`;
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = cssCode;

      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: jsxCode }}
          onClick={(e) => handleElementClick(e)}
        />
      );
    } catch (error) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 rounded-md text-red-600">
          Error rendering component: {error.message}
        </div>
      );
    }
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setSelectedElement(e.target);
    setShowPropertyPanel(true);
  };

  const handleCopyCode = async () => {
    try {
      const fullCode = `// JSX/TSX\n${code.jsx}\n\n// CSS\n${code.css}`;
      await navigator.clipboard.writeText(fullCode);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleDownloadCode = () => {
    const fullCode = `// JSX/TSX\n${code.jsx}\n\n// CSS\n${code.css}`;
    const blob = new Blob([fullCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.jsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
        <h3 className="text-lg font-semibold text-white">Component Preview</h3>
        <div className="flex gap-2">
          <button onClick={handleCopyCode} className="text-sm px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition">
            Copy
          </button>
          <button onClick={handleDownloadCode} className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
            Download
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2 gap-4 border-b border-gray-700 text-sm">
        {['preview', 'jsx', 'css'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Code/Preview Section */}
      <div className="flex-1 p-4 overflow-auto">
        <div className={`h-[400px] w-full border border-gray-700 bg-gray-900 rounded-lg p-4 ${blink ? 'ring-4 ring-blue-400' : ''}`}>
          {activeTab === 'preview' ? (
            code ? createComponent(code.jsx, code.css) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No component generated yet. Start chatting with AI.
              </div>
            )
          ) : (
            <pre className="text-sm text-white overflow-auto h-full whitespace-pre-wrap">
              <code>
                {activeTab === 'jsx' ? (code?.jsx || '// No JSX generated') : (code?.css || '// No CSS generated')}
              </code>
            </pre>
          )}
        </div>
      </div>

      {/* Property Panel */}
      {showPropertyPanel && selectedElement && (
        <div className="absolute top-20 right-4 w-64 bg-gray-900 text-white border border-gray-700 p-4 rounded-lg shadow-lg z-10">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold">Element Properties</h4>
            <button onClick={() => setShowPropertyPanel(false)} className="text-gray-400 hover:text-white">×</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-300">Padding</label>
              <input
                type="range"
                min="0"
                max="50"
                defaultValue="0"
                className="w-full"
                onChange={(e) => {
                  selectedElement.style.padding = `${e.target.value}px`;
                }}
              />
            </div>

            <div>
              <label className="text-xs text-gray-300">Background</label>
              <input
                type="color"
                className="w-full h-8 bg-gray-800 border border-gray-600 rounded"
                onChange={(e) => {
                  selectedElement.style.backgroundColor = e.target.value;
                }}
              />
            </div>

            <div>
              <label className="text-xs text-gray-300">Text Content</label>
              <input
                type="text"
                defaultValue={selectedElement.textContent}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white"
                onChange={(e) => {
                  selectedElement.textContent = e.target.value;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

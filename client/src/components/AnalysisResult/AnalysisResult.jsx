import React, { useState } from "react";
import "./AnalysisResult.scss";

const highlightText = (text) => {
  if (!text) return "";
  text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Highlight anything inside &lt;...&gt; as function name
  text = text.replace(
    /&lt;([^&]+)&gt;/g,
    (match, p1) => `<span class="function-name">&lt;${p1}&gt;</span>`
  );

  // Match long hex values (addresses, offsets, etc.)
  text = text.replace(
    /\b(0x)?[0-9a-fA-F]{6,}\b/g,
    (match) => `<span class="hex">${match}</span>`
  );

  // Match short byte pairs (not already matched)
  text = text.replace(
    /\b[0-9a-fA-F]{2}\b/g,
    (match) => `<span class="hex-byte">${match}</span>`
  );

  // Highlight brackets [ and ]
  text = text.replace(
    /([\[\]])/g,
    (match) => `<span class="bracket">${match}</span>`
  );

  // Section headers like .rela.dyn
  text = text.replace(
    /(\.[\w.]+)/g,
    (match) => `<span class="section-name">${match}</span>`
  );

  // Registers
  text = text.replace(
    /%[a-zA-Z0-9]+/g,
    (match) => `<span class="register">${match}</span>`
  );

  // Mnemonics
  text = text.replace(
    /\b(mov|sub|add|call|ret|jmp|test|je|cmp|push|pop|lea|xor)\b/gi,
    (match) => `<span class="mnemonic">${match}</span>`
  );

  // Decimal numbers
  text = text.replace(
    /\b\d+\b/g,
    (match) => `<span class="number">${match}</span>`
  );

  return text;
};

const AnalysisResult = ({ data }) => {
  if (!data) {
    return <div className="no-data">No analysis data available.</div>;
  }

  const sections = [
    { title: "ELF Header", content: data.header },
    { title: "Sections", content: data.sections },
    { title: "Symbols", content: data.symbols },
    { title: "Disassembly", content: data.disassembly },
  ];

  const [collapsed, setCollapsed] = useState(
    Array(sections.length).fill(false)
  );

  const toggleCollapse = (index) => {
    setCollapsed((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className="result-container">
      {sections.map((section, idx) => (
        <div key={idx} className="section">
          <div className="section-header">
            <h2 className="section-title">{section.title}</h2>
            <div className="section-controls">
              <button onClick={() => toggleCollapse(idx)}>
                {collapsed[idx] ? "Expand" : "Collapse"}
              </button>
              <button onClick={() => copyToClipboard(section.content)}>
                Copy
              </button>
            </div>
          </div>
          {!collapsed[idx] && (
            <div className="codeblock-wrapper">
              <pre
                className="codeblock"
                dangerouslySetInnerHTML={{
                  __html: highlightText(section.content),
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnalysisResult;

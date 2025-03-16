import React from "react";
import "./AnalysisResult.scss";

const highlightText = (text) => {
  if (!text) return "";

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

  // Section headers like [10] .rela.dyn
  text = text.replace(
    /^(\s*\[\s*\d+\s*\])\s+([.\w]+)/gm,
    (match, p1, p2) =>
      `<span class="section-number">${p1}</span> <span class="section-name">${p2}</span>`
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

  return (
    <div className="result-container">
      {sections.map((section, idx) => (
        <div key={idx} className="section">
          <h2 className="section-title">{section.title}</h2>
          <div className="codeblock-wrapper">
            <pre
              className="codeblock"
              dangerouslySetInnerHTML={{
                __html: highlightText(section.content),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalysisResult;

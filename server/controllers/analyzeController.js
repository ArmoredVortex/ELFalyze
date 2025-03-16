const { exec } = require('child_process');
const path = require('path');

exports.analyzeBinary = (req, res) => {
    console.log('Uploaded file:', req.file);  // 👈 add this
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    // ELF Header
    exec(`readelf -h ${filePath}`, (err, headerOut) => {
        if (err) return res.status(500).json({ error: 'Header extraction failed' });

        // Sections
        exec(`readelf -S ${filePath}`, (err, sectionOut) => {
            if (err) return res.status(500).json({ error: 'Section extraction failed' });

            // Symbols
            exec(`readelf -s ${filePath}`, (err, symbolOut) => {
                if (err) return res.status(500).json({ error: 'Symbol extraction failed' });

                // Disassembly (limit lines)
                exec(`objdump -d ${filePath}`, (err, disasmOut) => {
                    if (err) return res.status(500).json({ error: 'Disassembly failed' });

                    res.json({
                        header: headerOut,
                        sections: sectionOut,
                        symbols: symbolOut,
                        disassembly: disasmOut
                    });
                });
            });
        });
    });
};

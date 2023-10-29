const extensionMapping = {
    C: 'c_cpp',
    CPP: 'c_cpp',
    c: 'c_cpp',
    'c++': 'c_cpp',
    cc: 'c_cpp',
    cp: 'c_cpp',
    cpp: 'c_cpp',
    cs: 'csharp',
    css: 'css',
    cxx: 'c_cpp',
    h: 'c_cpp',
    htm: 'html',
    html: 'html',
    java: 'java',
    js: 'javascript',
    jsx: 'jsx',
    kt: 'kotlin',
    php: 'php',
    py: 'python',
    rb: 'ruby',
    R: 'r',
    sql: 'sql',
    sh: 'sh',
    swift: 'swift',
    yaml: 'yaml',
};

export default function extensionToAceMode(fileExtension) {
    return extensionMapping[fileExtension] || 'text';
}

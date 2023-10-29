export const codingLanguages = (hiddenIds: string[] = []) =>
    [
        {
            id: 'PYTHON3_10',
            loggingExample: 'print("my user log")',
        },
        {
            id: 'PYTHON3_8',
            loggingExample: 'print("my user log")',
        },
        {
            id: 'PYTHON3',
            loggingExample: 'print("my user log")',
        },
        {
            id: 'JAVA17',
            loggingExample: 'System.out.println("my user log")',
        },
        {
            id: 'JAVA11',
            loggingExample: 'System.out.println("my user log")',
        },
        {
            id: 'JAVA',
            loggingExample: 'System.out.println("my user log")',
        },
        {
            id: 'JS',
            loggingExample: 'console.log("my user log")',
        },
        {
            id: 'REACT16',
            loggingExample: 'console.log("my user log")',
        },
        {
            id: 'REACT18',
            loggingExample: 'console.log("my user log")',
        },
        {
            id: 'KOTLIN1_3',
            loggingExample: 'println("my user log")',
        },
        {
            id: 'CS',
            loggingExample: 'Console.WriteLine("my user log")',
        },
        {
            id: 'CS11',
            loggingExample: 'Console.WriteLine("my user log")',
        },
        {
            id: 'HTML',
            loggingExample: 'console.log("my user log")',
        },
        {
            id: 'CPP',
            loggingExample: 'std::cout << "my user log"',
        },
        {
            id: 'PHP7',
            loggingExample: 'echo "my user log"',
        },
        {
            id: 'PHP5',
            loggingExample: 'echo "my user log"',
        },
        {
            id: 'CSV',
            loggingExample: 'print("my user log")',
        },
        {
            id: 'R3_6',
            loggingExample: 'print("my user log",quote=FALSE)',
        },
        {
            id: 'RUBY',
            loggingExample: 'puts "my user log"',
        },
        {
            id: 'SCIPY1_4',
            loggingExample: 'print("my user log")',
        },
        {
            id: 'SQL',
            loggingExample: '',
        },
        {
            id: 'SQLITE3',
            loggingExample: '',
        },
        {
            id: 'SWIFT5',
            loggingExample: 'print("my user log")',
        },
        {
            id: 'SWIFT3',
            loggingExample: 'print("my user log")',
        },
    ].filter((language) => !hiddenIds.includes(language.id));

export const getCodingLanguage = (id: string) =>
    codingLanguages().find((language) => language.id === id);

import {formatNumber} from 'utils/numeral';
/* eslint-disable import/prefer-default-export */

// Which list the file is in, e.g. 'initial_files' if it is in prompt.initial_files.
export const CODING_FILE_ORIGIN = {
    INITIAL_FILES: 'initial_files',
    SOLUTION_FILES: 'solution_files',
    TEST_FILES: 'test_files',
    SYSTEM_FILES: 'system_files',
    SETUP_FILES: 'setup_files',
};

export const codingLanguages = (hiddenIds = []) =>
    [
        {
            id: 'PYTHON3_10',
            label: interpolate(
                pgettext('Python programming language', 'Python %(versionNumber)s'),
                {versionNumber: formatNumber('3.10')},
                true,
            ),
            shortLabel: interpolate(
                pgettext('Python programming language', 'Python %(versionNumber)s'),
                {versionNumber: formatNumber('3.10')},
                true,
            ),
            loggingExample: 'print("my user log")',
        },
        {
            id: 'PYTHON3_8',
            label: interpolate(
                pgettext('Python programming language', 'Python %(versionNumber)s'),
                {versionNumber: formatNumber('3.8')},
                true,
            ),
            loggingExample: 'print("my user log")',
        },
        {
            id: 'PYTHON3',
            label: interpolate(
                pgettext('Python programming language', 'Python %(versionNumber)s'),
                {versionNumber: formatNumber('3.5')},
                true,
            ),
            loggingExample: 'print("my user log")',
        },
        {
            id: 'JAVA17',
            label: interpolate(
                pgettext('Java programming language', 'Java %(versionNumber)s (with JUnit5)'),
                {versionNumber: formatNumber('17')},
                true,
            ),
            shortLabel: interpolate(
                pgettext('Java programming language', 'Java %(versionNumber)s'),
                {versionNumber: formatNumber('17')},
                true,
            ),
            loggingExample: 'System.out.println("my user log")',
        },
        {
            id: 'JAVA11',
            label: interpolate(
                pgettext('Java programming language', 'Java %(versionNumber)s'),
                {versionNumber: formatNumber('11')},
                true,
            ),
            loggingExample: 'System.out.println("my user log")',
        },
        {
            id: 'JAVA',
            label: interpolate(
                pgettext('Java programming language', 'Java %(versionNumber)s'),
                {versionNumber: formatNumber('9')},
                true,
            ),
            loggingExample: 'System.out.println("my user log")',
        },
        {
            id: 'JS',
            label: pgettext('JavaScript programming language', 'JavaScript ES6'),
            loggingExample: 'console.log("my user log")',
        },
        {
            id: 'REACT16',
            label: interpolate(
                pgettext('React JavaScript programming language', 'React %(versionNumber)s'),
                {versionNumber: formatNumber('16')},
                true,
            ),
            loggingExample: 'console.log("my user log")',
        },
        {
            id: 'KOTLIN1_3',
            label: interpolate(
                pgettext('Kotlin programming language', 'Kotlin %(versionNumber)s'),
                {versionNumber: formatNumber('1.3')},
                true,
            ),
            loggingExample: 'println("my user log")',
        },
        {
            id: 'CS',
            label: pgettext('C# programming language', 'C#'),
            loggingExample: 'Console.WriteLine("my user log")',
        },
        {
            id: 'CS11',
            label: pgettext('C# 11 programming language', '(NEW) C# 11'),
            loggingExample: 'Console.WriteLine("my user log")',
        },
        {
            id: 'HTML',
            label: pgettext('Hypertext Markup Language', 'HTML'),
            loggingExample: 'console.log("my user log")',
        },
        {
            id: 'CPP',
            label: pgettext('C++ programming language', 'C++'),
            loggingExample: 'std::cout << "my user log"',
        },
        {
            id: 'PHP7',
            label: interpolate(
                pgettext('PHP programming language', 'PHP %(versionNumber)s'),
                {versionNumber: formatNumber('7')},
                true,
            ),
            loggingExample: 'echo "my user log"',
        },
        {
            id: 'PHP5',
            label: interpolate(
                pgettext('PHP programming language', 'PHP %(versionNumber)s'),
                {versionNumber: formatNumber('5')},
                true,
            ),
            loggingExample: 'echo "my user log"',
        },
        {
            id: 'CSV',
            label: gettext('CSV processing (with Python)'),
            shortLabel: gettext('CSV processing'),
            loggingExample: 'print("my user log")',
        },
        {
            id: 'R3_6',
            label: interpolate(
                pgettext('R programming language', 'R %(versionNumber)s'),
                {versionNumber: formatNumber('3.6')},
                true,
            ),
            loggingExample: 'print("my user log",quote=FALSE)',
        },
        {
            id: 'RUBY',
            label: pgettext('Ruby programming language', 'Ruby'),
            loggingExample: 'puts "my user log"',
        },
        {
            id: 'SCIPY1_4',
            label: interpolate(
                pgettext(
                    'SciPy and SciKit Python programming languages',
                    'SciPy %(scipyVersionNumber)s (NumPy, Pandas, SymPy) and SciKit Learn %(scikitVersionNumber)s',
                ),
                {
                    scipyVersionNumber: formatNumber('1.4'),
                    scikitVersionNumber: formatNumber('0.23'),
                },
                true,
            ),
            shortLabel: pgettext('SciPy and SciKit Python programming languages', 'SciPy & SciKit'),
            loggingExample: 'print("my user log")',
        },
        {
            id: 'SQL',
            shortLabel: pgettext('SQL library name', 'AlaSQL'),
            label: pgettext(
                'SQL database language',
                'AlaSQL (MS SQL Server, MySQL, PostgreSQL, Oracle)',
            ),
            loggingExample: '',
        },
        {
            id: 'SQLITE3',
            label: pgettext('SQLite 3 database language', '(NEW) SQLite 3'),
            loggingExample: '',
        },
        {
            id: 'SWIFT5',
            label: interpolate(
                pgettext('Swift programming language', 'Swift %(versionNumber)s'),
                {versionNumber: formatNumber('5')},
                true,
            ),
            loggingExample: 'print("my user log")',
        },
        {
            id: 'SWIFT3',
            label: interpolate(
                pgettext('Swift programming language', 'Swift %(versionNumber)s'),
                {versionNumber: formatNumber('3')},
                true,
            ),
            loggingExample: 'print("my user log")',
        },
    ].filter((language) => !hiddenIds.includes(language.id));

export const getCodingLanguage = (id) => codingLanguages().find((language) => language.id === id);

export const DESCRIPTION_AI_TOKEN_LIMIT = 800;

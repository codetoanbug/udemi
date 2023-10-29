/*
 * Each language must have `documentationUrl` and at least one file in `initialFiles`.
 *
 * `initialFiles` and `solutionFiles` are related 1-1 by matching file_name.
 * By default an empty solution file is created for each initial file.
 *
 * `evaluationFile` is optional, although most languages need it.
 * If not defined, only `solutionFiles` are used to evaluate whether the code is working.
 *
 * A file has the following properties (see also ace.react-component.js):
 * - file_name (string, required)
 * - content (string, defaults to '')
 * - type (string, see `extensionToAceMode` for default value)
 */

export const jsLibBaseUrl = 'https://udemy-npm-packages.s3.amazonaws.com/ucp';

export default {
    cpp: {
        documentationUrl: '/developers/coding-exercises/cpp',
        initialFiles: [
            {
                file_name: 'exercise.cpp',
            },
            {
                file_name: 'exercise.h',
                content: `\
#ifndef EXERCISE_H
#define EXERCISE_H



#endif // _EXERCISE_H
`,
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.cpp',
            content: `\
#include "gtest/gtest.h"
#include "helpers/iohelper.h"

#include "exercise.h"


namespace {

class Evaluate : public ::testing::Test {

protected:
    Evaluate() {
        // You can do set-up work for each test here.
    }

    virtual ~Evaluate() {
        // You can do clean-up work that doesn't throw exceptions here.
    }

    // Objects declared here can be used by all tests in the test case for Foo.
};

TEST_F(Evaluate, ExampleTest) {
    // TODO
}

}  // namespace
`,
        },
    },
    cs: {
        documentationUrl: '/developers/coding-exercises/cs',
        initialFiles: [
            {
                file_name: 'Exercise.cs',
                content: `\
using System;

namespace Coding.Exercise
{
    public class Exercise
    {
        // TODO
    }
}
`,
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'Evaluate.cs',
            content: `\
using Coding.Exercise;
using NUnit.Framework;

namespace Coding.Exercise.UnitTests
{
    [TestFixture]
    public class FirstTestSuite
    {
        [Test]
        public void FirstTest()
        {
            // TODO
        }
    }
}
`,
        },
    },
    cs11: {
        documentationUrl: '/developers/coding-exercises/cs',
        initialFiles: [
            {
                file_name: 'Exercise.cs',
                content: `\
using System;

namespace Coding.Exercise
{
    public class Exercise
    {
        // TODO
    }
}
`,
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'Evaluate.cs',
            content: `\
using Coding.Exercise;

namespace Coding.Exercise.UnitTests
{
    [TestFixture]
    public class FirstTestSuite
    {
        [Test]
        public void FirstTest()
        {
            // TODO
        }
    }
}
`,
        },
    },
    html: {
        documentationUrl: '/developers/coding-exercises/html',
        initialFiles: [
            {
                file_name: 'index.html',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.js',
            content: `\
describe('subject', function() {
    it('should do an action', function() {
        // TODO
    });
});
`,
        },
    },
    js: {
        documentationUrl: '/developers/coding-exercises/html',
        initialFiles: [
            {
                file_name: 'index.js',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.js',
            content: `\
describe('subject', function() {
    it('should do an action', function() {
        // TODO
    });
});
`,
        },
        outputRunnerFile: {
            file_name: 'evaluate.js',
            content: `\
describe('subject', function() {
    it('should do an action', function() {

    });
});
`,
        },
    },
    react16: {
        documentationUrl: '/developers/coding-exercises/react',
        initialFiles: [
            {
                file_name: 'App.js',
                type: 'jsx',
                content: `\
import React from 'react';

// don't change the Component name "App"
export default class App extends React.Component {
  render() {
    // TODO: implement component
  }
}
`,
            },
        ],
        systemFiles: [
            {
                file_name: 'index.html',
                content: `\
<script src="${jsLibBaseUrl}/react-16.13.0.development.js"></script>
<script src="${jsLibBaseUrl}/react-dom-16.13.0.development.js"></script>
<script class="babelScript" src="${jsLibBaseUrl}/babel-7.8.7.min.js"></script>
<script src="${jsLibBaseUrl}/polyfill-7.4.0.min.js"></script>
<script type="text/javascript">
// this must run before any babel-compiled modules, so should probably
// be the first script in your page
window.exports = window;
var require = (module) => {
    if (module === "react") return React;
    if (module === "react-dom") return ReactDOM;
};
var Component = React.Component;
var PropTypes = React.PropTypes;
</script>
<script type="text/babel" data-presets="env,react">
window.onload = function(e){
    ReactDOM.render(<App />, document.getElementById('app'));
}
</script>
<div id="app"></div>
`,
            },
        ],
        solutionFiles: [
            {
                file_name: 'App.js',
                type: 'jsx',
                content: `\
import React from 'react';

// don't change the Component name "App"
export default class App extends React.Component {
  render() {
    return <h1>Hello, world!</h1>;
  }
}
`,
            },
        ],
        evaluationFile: {
            file_name: 'App.spec.js',
            type: 'jsx',
            content: `\
import React from 'react';

import App from './App.js';
import { shallow } from 'enzyme';

describe('App component', () => {
    it('should render', () => {
        // TODO: customize this for your compoennt
        const wrapper = shallow(
            <App />
        );
        expect(wrapper.text(), 'App renders').toContain('Hello, world!');
    });
    it('should do something else', () => {
        // TODO: check something else
    });
});
`,
        },
    },
    react18: {
        documentationUrl: '/developers/coding-exercises/react18',
        initialFiles: [
            {
                file_name: 'App.js',
                type: 'jsx',
                content: `\
import React from 'react';

// don't change the Component name "App"
export default class App extends React.Component {
  render() {
    // TODO: implement component
  }
}
`,
            },
        ],
        systemFiles: [
            {
                file_name: 'index.html',
                content: `\
<script src="${jsLibBaseUrl}/react-18.2.0.development.js"></script>
<script src="${jsLibBaseUrl}/react-dom-18.2.0.development.js"></script>
<script class="babelScript" src="${jsLibBaseUrl}/babel-7.8.7.min.js"></script>
<script src="${jsLibBaseUrl}/polyfill-7.4.0.min.js"></script>
<script type="text/javascript">
// this must run before any babel-compiled modules, so should probably
// be the first script in your page
window.exports = window;
var require = (module) => {
    if (module === "react") return React;
    if (module === "react-dom") return ReactDOM;
};
var Component = React.Component;
var PropTypes = React.PropTypes;
</script>
<script type="text/babel" data-presets="env,react">
window.onload = function(e){
    ReactDOM.render(<App />, document.getElementById('app'));
}
</script>
<div id="app"></div>
`,
            },
        ],
        solutionFiles: [
            {
                file_name: 'App.js',
                type: 'jsx',
                content: `\
import React from 'react';

// don't change the Component name "App"
export default class App extends React.Component {
  render() {
    return <h1>Hello, world!</h1>;
  }
}
`,
            },
        ],
        evaluationFile: {
            file_name: 'App.spec.js',
            type: 'jsx',
            content: `\
import React from 'react';

import App from '../src/App.js';
import { render, screen } from '@testing-library/react';

describe('App component', () => {
    test('should render', () => {
        // TODO: customize this for your compoennt
        render(
            <App />
        );
        const linkElement = screen.getByText(/Hello, world!/i);
        expect(linkElement,"Header should be rendered").toBeInTheDocument();
    });
    test('should do something else', () => {
        // TODO: check something else
    });
});
`,
        },
    },
    java: {
        documentationUrl: '/developers/coding-exercises/java',
        initialFiles: [
            {
                file_name: 'Exercise.java',
                content: 'public class Exercise {\n\n}',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'Evaluate.java',
            content: `\
import org.junit.Test;
import org.junit.Assert;
import com.udemy.ucp.*;

public class Evaluate {
    @Test
    public void testExercise() {
        // TODO
    }
}
`,
        },
    },
    java11: {
        documentationUrl: '/developers/coding-exercises/java',
        initialFiles: [
            {
                file_name: 'Exercise.java',
                content: 'public class Exercise {\n\n}',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'Evaluate.java',
            content: `\
import org.junit.Test;
import org.junit.Assert;
import com.udemy.ucp.*;

public class Evaluate {
    @Test
    public void testExercise() {
        // TODO
    }
}
`,
        },
    },
    java17: {
        documentationUrl: '/developers/coding-exercises/java17',
        initialFiles: [
            {
                file_name: 'Exercise.java',
                content: 'public class Exercise {\n\n}',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'Evaluate.java',
            content: `\
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import com.udemy.ucp.*;

public class Evaluate {
    @Test
    public void testExercise() {
        // TODO
    }
}
`,
        },
    },
    csv: {
        documentationUrl: '/developers/coding-exercises/python_3',
        initialFiles: [
            {
                file_name: 'exercise.py',
                content: `\
from csv import DictReader

with open('input.csv') as csvfile:
    csvreader = DictReader(csvfile)
    for row in csvreader:
        # process a row from the CSV file
`,
            },
            {
                file_name: 'input.csv',
                content: `\
Name, Test 1, Test 2, Test 3
Test Student, 60, 73, 79
`,
            },
        ],
        solutionFiles: [
            {
                file_name: 'exercise.py',
                content: `\
from csv import DictReader

with open('input.csv') as csvfile:
    csvreader = DictReader(csvfile)
    for row in csvreader:
        print('Row: ', row)
        # TODO: process data
`,
            },
            {
                file_name: 'input.csv',
                content: `\
Name, Test 1, Test 2, Test 3
Test Student, 60, 73, 79
`,
            },
        ],
        evaluationFile: {
            file_name: 'evaluate.py',
            content: `\
import sys
from unittest import TestCase

class Evaluate(TestCase):
    def test_exercise(self):
        import exercise  # Imports and runs student's solution
        output = sys.stdout.getvalue()  # Returns output since this function started
        # TODO: test the output
`,
        },
    },
    kotlin1_3: {
        documentationUrl: '/developers/coding-exercises/kotlin',
        initialFiles: [
            {
                file_name: 'Exercise.kt',
                content: 'class Exercise {\n\n}',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'Evaluate.kt',
            content: `\
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals

class Evaluate {
    @Test
    fun testExercise() {
        // TODO
    }
}
`,
        },
    },
    php5: {
        documentationUrl: '/developers/coding-exercises/php',
        initialFiles: [
            {
                file_name: 'exercise.php',
                content: `\
<?php

`,
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.php',
            content: `\
<?php
use PHPUnit\\Framework\\TestCase;

class Evaluate extends TestCase {
    public function testExercise() {
        // TODO
    }
}
`,
        },
    },
    php7: {
        documentationUrl: '/developers/coding-exercises/php',
        initialFiles: [
            {
                file_name: 'exercise.php',
                content: `\
<?php

`,
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.php',
            content: `\
<?php
use PHPUnit\\Framework\\TestCase;

class Evaluate extends TestCase {
    public function testExercise() {
        // TODO
    }
}
`,
        },
    },
    python3: {
        documentationUrl: '/developers/coding-exercises/python_3',
        initialFiles: [
            {
                file_name: 'exercise.py',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.py',
            content: `\
from unittest import TestCase

class Evaluate(TestCase):
    def test_exercise(self):
        # TODO
`,
        },
        outputRunnerFile: {
            file_name: 'evaluate.py',
            content: `\
from unittest import TestCase

class Evaluate(TestCase):
    def test_exercise(self):
        import {}
`,
        },
    },
    python3_8: {
        documentationUrl: '/developers/coding-exercises/python_3',
        initialFiles: [
            {
                file_name: 'exercise.py',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.py',
            content: `\
from unittest import TestCase

class Evaluate(TestCase):
    def test_exercise(self):
        # TODO
`,
        },
        outputRunnerFile: {
            file_name: 'evaluate.py',
            content: `\
from unittest import TestCase

class Evaluate(TestCase):
    def test_exercise(self):
        import {}
`,
        },
    },
    python3_10: {
        documentationUrl: '/developers/coding-exercises/python_3',
        initialFiles: [
            {
                file_name: 'exercise.py',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.py',
            content: `\
from unittest import TestCase

class Evaluate(TestCase):
    def test_exercise(self):
        # TODO
`,
        },
        outputRunnerFile: {
            file_name: 'evaluate.py',
            content: `\
from unittest import TestCase

class Evaluate(TestCase):
    def test_exercise(self):
        import {}
`,
        },
    },
    r3_6: {
        documentationUrl: '/developers/coding-exercises/r3_6',
        initialFiles: [
            {
                file_name: 'exercise.R',
                content: '# TODO: write some code here',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'test-exercise.R',
            content: `\
setwd("..")
# Import the file from the exercise you want to test. Replace exercise.R with the name of your file
source("exercise.R", chdir = TRUE)

library(testthat) # This line is required to import the test harness

# put your tests beyond this line
`,
        },
    },
    ruby: {
        documentationUrl: '/developers/coding-exercises/ruby',
        initialFiles: [
            {
                file_name: 'exercise.rb',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.rb',
            content: `\
require "minitest/autorun"
require "./exercise"

class Evaluate < Minitest::Test
    # TODO
end
`,
        },
    },
    scipy1_4: {
        documentationUrl: '/developers/coding-exercises/python_data_science',
        initialFiles: [
            {
                file_name: 'exercise.py',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'evaluate.py',
            content: `\
from unittest import TestCase

from numpy.testing import assert_, assert_raises

class Evaluate(TestCase):
    def test_exercise(self):
        # TODO
`,
        },
    },
    sql: {
        documentationUrl: '/developers/coding-exercises/sql',
        initialFiles: [
            {
                file_name: 'query.sql',
            },
        ],
        solutionFiles: [],
        setupFiles: [
            {
                file_name: 'setup.sql',
                content: `\
/*
    Modify your database setup accordingly, or remove all content (including this comment) if you do not require any database setup.
*/
CREATE TABLE my_table (column_1 string, column_2 string);
INSERT INTO my_table VALUES ("value 1", "value 2"), ("value 3", "value 4");
`,
            },
        ],
    },
    sqlite3: {
        documentationUrl: '/developers/coding-exercises/sqlite3',
        initialFiles: [
            {
                file_name: 'query.sql',
            },
        ],
        solutionFiles: [],
        setupFiles: [
            {
                file_name: 'setup.sql',
                content: `\
/*
    Modify your database setup accordingly, or remove all content (including this comment) if you do not require any database setup.
*/
CREATE TABLE my_table (column_1 string, column_2 string);
INSERT INTO my_table VALUES ("value 1", "value 2"), ("value 3", "value 4");
`,
            },
        ],
    },
    swift3: {
        documentationUrl: '/developers/coding-exercises/swift',
        initialFiles: [
            {
                file_name: 'Exercise.swift',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'Evaluate.swift',
            content: `\
import XCTest
import Foundation
@testable import Base

class Evaluate: UMBaseTestCase {
    func testExample() {
        // TODO: add some tests
    }
}

extension Evaluate {
    static var allTests : [(String, (Evaluate) -> () throws -> Void)] {
        return [
            ("testExample", testExample)
        ]
    }
}
`,
        },
    },
    swift5: {
        documentationUrl: '/developers/coding-exercises/swift',
        initialFiles: [
            {
                file_name: 'Exercise.swift',
            },
        ],
        solutionFiles: [],
        evaluationFile: {
            file_name: 'Evaluate.swift',
            content: `\
import XCTest
import Foundation
@testable import Base

class Evaluate: UMBaseTestCase {
    func testExample() {
        // TODO: add some tests
    }
}
`,
        },
    },
};

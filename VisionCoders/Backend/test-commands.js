/**
 * Test suite for command detection and RAG prompts
 * Run with: node test-commands.js
 */

// Mock the command detection logic
const CommandType = {
    SUMMARIZE: 'SUMMARIZE',
    SHORT_NOTES: 'SHORT_NOTES',
    QUIZ: 'QUIZ',
    EXPLAIN: 'EXPLAIN',
    NONE: 'NONE'
};

const COMMAND_PATTERNS = {
    [CommandType.SUMMARIZE]: [
        /^summar(y|ize|ise)(\s|$)/i,
        /^give\s+me\s+a\s+summar/i,
        /^create\s+summar/i,
        /^\[summary\]/i,
    ],
    [CommandType.SHORT_NOTES]: [
        /^(short\s+)?notes(\s|$)/i,
        /^make\s+notes/i,
        /^create\s+notes/i,
        /^give\s+me\s+notes/i,
        /^\[notes\]/i,
    ],
    [CommandType.QUIZ]: [
        /^quiz(\s|$)/i,
        /^test\s+me/i,
        /^create\s+quiz/i,
        /^generate\s+quiz/i,
        /^make\s+a\s+quiz/i,
        /^test$/i,
        /^\[quiz\]/i,
    ],
    [CommandType.EXPLAIN]: [
        /^explain\s+(.+)$/i,
        /^what\s+is\s+(.+)$/i,
        /^define\s+(.+)$/i,
        /^tell\s+me\s+about\s+(.+)$/i,
    ],
    [CommandType.NONE]: [],
};

function detectCommand(message) {
    const trimmed = message.trim();

    for (const [command, patterns] of Object.entries(COMMAND_PATTERNS)) {
        for (const pattern of patterns) {
            const match = trimmed.match(pattern);
            if (match) {
                if (command === CommandType.EXPLAIN && match[1]) {
                    return {
                        command: command,
                        concept: match[1].trim(),
                    };
                }
                return { command: command };
            }
        }
    }

    return { command: CommandType.NONE };
}

// Test cases
const testCases = [
    // SUMMARIZE tests
    { input: 'summarize', expected: 'SUMMARIZE', shouldWork: true },
    { input: 'summarize chapter 1', expected: 'SUMMARIZE', shouldWork: true },
    { input: 'summarise the document', expected: 'SUMMARIZE', shouldWork: true },
    { input: 'summary', expected: 'SUMMARIZE', shouldWork: true },
    { input: 'give me a summary of section 2', expected: 'SUMMARIZE', shouldWork: true },
    { input: '[Summary] summarise chapter 1', expected: 'SUMMARIZE', shouldWork: true },

    // QUIZ tests
    { input: 'quiz', expected: 'QUIZ', shouldWork: true },
    { input: 'quiz me on photosynthesis', expected: 'QUIZ', shouldWork: true },
    { input: 'test me', expected: 'QUIZ', shouldWork: true },
    { input: 'create quiz', expected: 'QUIZ', shouldWork: true },
    { input: 'generate quiz for chapter 3', expected: 'QUIZ', shouldWork: true },
    { input: '[Quiz] test me on biology', expected: 'QUIZ', shouldWork: true },

    // NOTES tests
    { input: 'notes', expected: 'SHORT_NOTES', shouldWork: true },
    { input: 'short notes', expected: 'SHORT_NOTES', shouldWork: true },
    { input: 'make notes for section 2', expected: 'SHORT_NOTES', shouldWork: true },
    { input: 'create notes on topic X', expected: 'SHORT_NOTES', shouldWork: true },
    { input: '[Notes] make notes for chapter 1', expected: 'SHORT_NOTES', shouldWork: true },

    // EXPLAIN tests
    { input: 'explain photosynthesis', expected: 'EXPLAIN', shouldWork: true, concept: 'photosynthesis' },
    { input: 'what is gravity', expected: 'EXPLAIN', shouldWork: true, concept: 'gravity' },
    { input: 'define machine learning', expected: 'EXPLAIN', shouldWork: true, concept: 'machine learning' },
    { input: 'tell me about neural networks', expected: 'EXPLAIN', shouldWork: true, concept: 'neural networks' },

    // NONE tests (regular chat)
    { input: 'hello', expected: 'NONE', shouldWork: true },
    { input: 'what are the main topics?', expected: 'NONE', shouldWork: true },
    { input: 'can you help me understand this?', expected: 'NONE', shouldWork: true },
];

// Run tests
console.log('🧪 Testing Command Detection\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
    const result = detectCommand(test.input);
    const success = result.command === test.expected;

    if (test.concept) {
        const conceptMatch = result.concept === test.concept;
        if (success && conceptMatch) {
            console.log(`✅ Test ${index + 1}: PASS`);
            console.log(`   Input: "${test.input}"`);
            console.log(`   Expected: ${test.expected} (concept: "${test.concept}")`);
            console.log(`   Got: ${result.command} (concept: "${result.concept}")`);
            passed++;
        } else {
            console.log(`❌ Test ${index + 1}: FAIL`);
            console.log(`   Input: "${test.input}"`);
            console.log(`   Expected: ${test.expected} (concept: "${test.concept}")`);
            console.log(`   Got: ${result.command} (concept: "${result.concept || 'none'}")`);
            failed++;
        }
    } else {
        if (success) {
            console.log(`✅ Test ${index + 1}: PASS`);
            console.log(`   Input: "${test.input}"`);
            console.log(`   Expected: ${test.expected}`);
            console.log(`   Got: ${result.command}`);
            passed++;
        } else {
            console.log(`❌ Test ${index + 1}: FAIL`);
            console.log(`   Input: "${test.input}"`);
            console.log(`   Expected: ${test.expected}`);
            console.log(`   Got: ${result.command}`);
            failed++;
        }
    }
    console.log('');
});

console.log('='.repeat(80));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
    console.log('\n🎉 All tests passed! Command detection is working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Review the patterns.');
}

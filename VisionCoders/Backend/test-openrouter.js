/**
 * Simple test script to verify OpenRouter integration
 * Run with: node test-openrouter.js
 */

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

async function testEmbedding() {
    console.log('🧪 Testing OpenRouter Embedding...');

    try {
        const response = await fetch(`${OPENROUTER_API_URL}/embeddings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/text-embedding-3-small',
                input: 'Hello, this is a test!'
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error: ${response.status} - ${error}`);
        }

        const result = await response.json();
        console.log('✅ Embedding generated successfully!');
        console.log(`   Dimensions: ${result.data[0].embedding.length}`);
        console.log(`   First 5 values: ${result.data[0].embedding.slice(0, 5).join(', ')}`);
        return true;
    } catch (error) {
        console.error('❌ Embedding test failed:', error.message);
        return false;
    }
}

async function testChatCompletion() {
    console.log('\n🧪 Testing OpenRouter Chat Completion...');

    try {
        const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                    { role: 'user', content: 'Say "OpenRouter is working!" in exactly 3 words.' }
                ],
                max_tokens: 50
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error: ${response.status} - ${error}`);
        }

        const result = await response.json();
        const message = result.choices[0].message.content;
        console.log('✅ Chat completion generated successfully!');
        console.log(`   Response: "${message}"`);
        return true;
    } catch (error) {
        console.error('❌ Chat completion test failed:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 OpenRouter Integration Test\n');
    console.log('='.repeat(50));

    const embeddingResult = await testEmbedding();
    const chatResult = await testChatCompletion();

    console.log('\n' + '='.repeat(50));
    console.log('\n📊 Test Results:');
    console.log(`   Embedding: ${embeddingResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Chat: ${chatResult ? '✅ PASS' : '❌ FAIL'}`);

    if (embeddingResult && chatResult) {
        console.log('\n🎉 All tests passed! OpenRouter is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Check your API key and network connection.');
    }
}

runTests();

# Backend API Implementation Task List

## Phase 1: Project Setup & Dependencies
- [x] Install required dependencies (Next.js, Gemini AI SDK, pdf-parse, etc.)
- [x] Configure environment variables
- [x] Set up Supabase connection and vector extension

## Phase 2: Core Library - Utils & Types
- [x] Create `lib/utils/types.ts` - TypeScript interfaces
- [x] Create `lib/utils/logger.ts` - Error tracing
- [x] Create `lib/utils/responseFormatter.ts` - Markdown formatting

## Phase 3: PDF Processing Library
- [x] Create `lib/pdf/extract.ts` - Extract raw text from PDF
- [x] Create `lib/pdf/chunk.ts` - Chunk text into token-limited blocks

## Phase 4: RAG Pipeline Library
- [x] Create `lib/rag/embed.ts` - Create embeddings via Gemini
- [x] Create `lib/rag/vectorStore.ts` - Insert/search vector DB
- [x] Create `lib/rag/retrieve.ts` - Top-k semantic search
- [x] Create `lib/rag/buildPrompt.ts` - Assemble system prompt + context
- [x] Create `lib/rag/llm.ts` - LLM completion wrapper

## Phase 5: Services Layer
- [x] Create `lib/services/botService.ts` - Bot creation + metadata
- [x] Create `lib/services/fileService.ts` - Handle file lifecycle
- [x] Create `lib/services/chatService.ts` - Command detection + routing

## Phase 6: Prompts
- [x] Create `lib/prompts/global.ts` - Strict grounding rules
- [x] Create `lib/prompts/summarize.ts` - Summarize command prompt
- [x] Create `lib/prompts/notes.ts` - Short notes command prompt
- [x] Create `lib/prompts/quiz.ts` - Quiz generation prompt
- [x] Create `lib/prompts/explain.ts` - Explanation prompt

## Phase 7: API Routes - Core
- [x] Create `app/api/bot/route.ts` - Bot creation endpoint
- [x] Create `app/api/upload/route.ts` - PDF upload handler
- [x] Create `app/api/process-pdf/route.ts` - Extract & chunk text
- [x] Create `app/api/embed/route.ts` - Generate embeddings + store vectors

## Phase 8: API Routes - Chat & Commands
- [x] Create `app/api/chat/route.ts` - Main RAG pipeline with command routing
- [x] Create `app/api/summarize/route.ts` - Summarization handler
- [x] Create `app/api/short-notes/route.ts` - Notes handler
- [x] Create `app/api/quiz/route.ts` - Quiz handler

## Phase 9: Integration & CORS
- [x] Configure CORS in `next.config.js`
- [x] Create Frontend Integration Guide

## Phase 10: Final Verification
- [ ] Run Backend Server (`npm run dev`)
- [ ] Run Frontend Server
- [ ] Verify Bot Creation Flow
- [ ] Verify PDF Upload & Processing
- [ ] Verify Chat & RAG Responses
- [ ] Verify Commands (Summarize, Notes, Quiz)

## Phase 11: Support & Documentation
- [x] Create `database_setup.sql` for Supabase
- [x] Create `backend_testing_guide.md` for API testing

## Phase 12: Schema Alignment
- [x] Update `database_setup.sql` to match user's schema
- [x] Refactor `botService.ts` (bots -> chatbots)
- [x] Refactor `fileService.ts` (files -> pdf_documents)
- [x] Refactor `vectorStore.ts` (embeddings -> document_chunks)

## Checkpoints (User Confirmation Required)
- ✓ After Phase 2: Utils & Types
- ✓ After Phase 3: PDF Processing
- ✓ After Phase 4: RAG Pipeline
- ✓ After Phase 5: Services
- ✓ Before Phase 6: Prompts (user will provide strict guidelines)
- ✓ After Phase 7: Core API Routes
- ✓ After Phase 8: Chat & Command Routes
- ✓ After Phase 9: Integration Setup
- [ ] After Phase 10: Final Verification
- ✓ After Phase 11: Support & Documentation
- ✓ After Phase 12: Schema Alignment

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { X, Copy, Check, Code2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor: string;
}

export function CodeEditor({ isOpen, onClose, themeColor }: CodeEditorProps) {
  const [code, setCode] = useState<string>(`// Write your code here
function example() {
  console.log("Hello World!");
}

// Start coding...`);
  const [language, setLanguage] = useState<string>("javascript");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    
    // Set template code based on language
    const templates: Record<string, string> = {
      javascript: `// JavaScript
function example() {
  console.log("Hello World!");
}`,
      python: `# Python
def example():
    print("Hello World!")`,
      java: `// Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
      cpp: `// C++
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
      typescript: `// TypeScript
function example(): void {
  console.log("Hello World!");
}`,
      sql: `-- SQL
SELECT * FROM users
WHERE active = true;`,
    };
    
    setCode(templates[lang] || "// Start coding...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" style={{ color: themeColor }} />
              Code Editor
            </DialogTitle>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-3 py-1.5 border rounded-md text-sm bg-white"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="sql">SQL</option>
              </select>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full rounded-lg border-2 bg-gray-50 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
              style={{
                minHeight: "100%",
                tabSize: 2,
              }}
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-600">
          <span>Real-time collaborative coding environment</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Session
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import z from 'zod';
import { Button } from './ui/button';
import { problemType, submissionType } from '@/types';

// Zod schema (unchanged)
const submissionSchema = z.object({
  source_code: z.string(),
  problemId: z.string(),
  stdin: z.string(),
  expected_output: z.string(),
  language_id: z.number(),
  cpu_time_limit: z.number().optional(),
  memory_limit: z.number().optional(),
});

const ProblemClient = ({ problem }: { problem: problemType }) => {
  const [tab, setTab] = useState<'description' | 'submissions' | 'single-submission'>('description');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<number>();
  const [submissions, setSubmissions] = useState<submissionType[]>([]);
  const [activeSubmission, setActiveSubmission] = useState<submissionType | null>(null);
  const params = useParams();
  const problemId = params.problemId as string;

  const handleSubmit = async () => {
    const stdin = problem.testCases.map(t => t.input).join('\n');
    const expected_output = problem.testCases.map(t => t.output).join('\n');

    const payload: z.infer<typeof submissionSchema> = {
      source_code: btoa(code),
      language_id: language!,
      problemId,
      stdin: btoa(stdin),
      expected_output: btoa(expected_output),
    };

    try {
      const { data } = await axios.post('/api/submission', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Submission Result:', data);
      alert('Code submitted!');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data } = await axios.get<{ submissions: submissionType[] }>(
        `/api/submission?problemId=${problemId}`
      );
      setSubmissions(data.submissions);
    } catch (err) {
      console.error("Failed to load submissions", err);
    }
  };

  useEffect(() => {
    if (tab === 'submissions') {
      fetchSubmissions();
    }
  }, [tab]);

  return (
    <div className="flex flex-col sm:flex-row w-full h-screen px-4 sm:px-12 py-6 gap-6">
      {/* LEFT PANEL */}
      <div className="w-full sm:w-1/2 rounded-xl shadow-md p-4 overflow-y-auto">

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <Button variant={tab === 'description' ? 'default' : 'outline'} onClick={() => setTab('description')}>
            Description
          </Button>
          <Button variant={tab === 'submissions' ? 'default' : 'outline'} onClick={() => setTab('submissions')}>
            Submissions
          </Button>
        </div>

        {/* TAB CONTENT */}
        {tab === 'description' && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-white">{problem.problem.title}</h1>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{problem.problem.description}</p>

            <div>
              <h2 className="text-lg font-semibold mb-2">Sample Test Cases</h2>
              <ul className="space-y-3">
                {problem.testCases.map((tc, i) => (
                  <li key={i} className="rounded p-2">
                    <p><span className="font-semibold">Input:</span> {tc.input}</p>
                    <p><span className="font-semibold">Output:</span> {tc.output}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {tab === 'submissions' && !activeSubmission && (
          <>
            <h2 className="text-xl font-bold mb-4">Your Submissions</h2>
            <ul className="space-y-3">
              {submissions.length === 0 ? (
                <p className="text-gray-400">No submissions yet.</p>
              ) : (
                submissions.map((s, i) => (
                  <li key={s.id || i} className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        setActiveSubmission(s);
                        setTab('single-submission');
                      }}
                  >
                    <p><strong>Language:</strong> {s.language}</p>
                    <p><strong>Status:</strong> {s.status}</p>
                    <p><strong>Time:</strong> {new Date(s.createdAt).toLocaleString()}</p>
                  </li>
                ))
              )}
            </ul>
          </>
        )}

        {tab === 'single-submission' && activeSubmission && (
          <div>
            <Button variant="ghost" onClick={() => {
              setActiveSubmission(null);
              setTab('submissions');
            }}>← Back to Submissions</Button>

            <h2 className="text-xl font-bold mt-4 mb-2">Submission Details</h2>
            <p><strong>Language:</strong> {activeSubmission.language}</p>
            <p><strong>Status:</strong> {activeSubmission.status}</p>
            <p><strong>Submitted At:</strong> {new Date(activeSubmission.createdAt).toLocaleString()}</p>

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Submitted Code:</h3>
              <pre className="bg-gray-800 text-white p-3 rounded text-sm whitespace-pre-wrap">
                {atob(activeSubmission.source_code)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Code Editor */}
      <div className="w-full sm:w-1/2 flex flex-col rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {problem.languages.map(l => (
              <option className="bg-black text-white" value={l.id} key={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Write your code here..."
          className="flex-grow border rounded p-3 font-mono text-sm mb-4 resize-none border-gray-300 hover:border-gray-400"
          style={{ minHeight: '300px' }}
        />

        <Button onClick={handleSubmit}>Submit Code</Button>
      </div>
    </div>
  );
};

export default ProblemClient;

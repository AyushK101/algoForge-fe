'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import z from 'zod';
import { Button } from './ui/button';
import { GetSubmissionType, problemType, submissionSchema, submissionType } from '@/types';

import { Submission } from '@prisma/client';
import ButtonSpinner from './ui/ButtonSpinner';
import { toast } from 'sonner';
import CodeEditor from './CodeEditor';

// Zod schema (unchanged)

const ProblemClient = ({ problem }: { problem: problemType }) => {
  // console.log({ problem });
  const [tab, setTab] = useState<'description' | 'submissions' | 'single-submission' | 'result'>('description');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<{ id: number, name: string, is_archived: boolean }>({
    "id": 76,
    "name": "C++ (GCC 9.2.0)",
    is_archived: false
  });
  const [submissions, setSubmissions] = useState<submissionType[]>([]);
  const [activeSubmission, setActiveSubmission] = useState<GetSubmissionType | null>(null);
  const params = useParams();
  const [result, setResult] = useState<Submission | undefined>(undefined);
  const problemId = params.problemId as string;
  const [submitting, setSubmitting] = useState(false);
  const [getSubmissions, setGetSubmissions] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const stdin = problem.testCases.map(t => t.input).join('\n');
    const expected_output = problem.testCases.map(t => t.output).join('\n');

    if (code.trim() == '') {
      toast('💦 enter something!', { position: 'top-right' });
      setSubmitting(false);
      return;
    }

    const payload: z.infer<typeof submissionSchema> = {
      source_code: btoa(code),
      language: { id: language.id, name: language.name },
      problemId,
      stdin: btoa(stdin),
      expected_output: btoa(expected_output),
    };

    try {
      const { data }: { data: { success: boolean, error?: string, submission?: Submission } } = await axios.post('/api/submission', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Submission Result:', data);
      // alert('Code submitted!');

      // toast(`result: ${result}`);
      setResult(data.submission);
      setTab('result');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // console.log(language);
  const fetchSubmissions = async () => {
    setGetSubmissions(true);
    try {
      const { data } = await axios.get<{ submissions: submissionType[] }>(
        `/api/submission/${problemId}`
      );
      setSubmissions(data.submissions);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setGetSubmissions(false);
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
          <Button variant={tab === 'submissions' ? 'default' : 'outline'} onClick={() => {
            setActiveSubmission(null);
            setTab('submissions')
          }}>
            Submissions
          </Button>

          <Button variant={tab === 'result' ? 'default' : 'outline'} onClick={() => setTab('result')}>
            result
          </Button>
        </div>

        {/* TAB CONTENT */}

        {tab === 'result' && result && (
          <div className="flex flex-col space-y-4 p-4  rounded-lg shadow-md">
            <div>
              <h2 className="text-lg font-bold ">Execution Result</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-bold">Status:</span>{' '}
                <span
                  className={`ml-1 font-semibold ${result.status === 'Accepted'
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}
                >
                  {result.status}
                </span>
              </div>
              <div>
                <span className="font-bold ">Time: </span>{' '}
                {result.time ? `${result.time} sec` : 'N/A'}
              </div>
              <div>
                <span className="font-bold ">Memory: </span>{' '}
                {result.memory ? `${result.memory} KB` : 'N/A'}
              </div>
              <div>
                <span className="font-bold ">Token: </span>{' '}
                {result.token}
              </div>
            </div>

            {result.stdout && (
              <div>
                <h3 className="font-bold mt-4">Output (stdout)</h3>
                <pre className=" border rounded p-2 text-sm  overflow-x-auto">
                  {atob(result.stdout)}
                </pre>
              </div>
            )}
            {(
              <div>
                <h3 className="font-bold mt-4">Expected (stdout)</h3>
                <pre className=" border rounded p-2 text-sm  overflow-x-auto">
                  {problem.testCases.map(t => t.output).join('\n')}
                </pre>
              </div>
            )}

            {result.stderr && (
              <div>
                <h3 className="font-medium text-red-600 mt-4">Standard Error (stderr)</h3>
                <pre className=" border border-red-200 rounded p-2 text-sm text-red-700 overflow-x-auto">
                  {atob(result.stderr)}
                </pre>
              </div>
            )}

            {result.compile_output && (
              <div>
                <h3 className="font-medium text-yellow-600 mt-4">Compile Output</h3>
                <pre className=" border border-yellow-200 rounded p-2 text-sm text-yellow-700 overflow-x-auto">
                  {atob(result.compile_output)}
                </pre>
              </div>
            )}

            {result.message && (
              <div>
                <h3 className="font-medium text-blue-600 mt-4">Message</h3>
                <pre className=" border border-blue-200 rounded p-2 text-sm text-blue-700 overflow-x-auto">
                  {atob(result.message)}
                </pre>
              </div>
            )}
          </div>
        )}

        {
          tab === 'result' && !result && (
            <>
              <h1 className='flex justify-center text-5xl font-bold'>💦 NOT SUBMITTED YET</h1>
            </>
          )
        }


        {tab === 'description' && (
          <>
            <h1 className="text-2xl font-bold mb-4 ">{problem.problem.title}</h1>
            <p className=" mb-4 whitespace-pre-wrap">{problem.problem.description}</p>

            <div>
              <h2 className="text-lg font-semibold mb-2">Test Cases (stdout) :</h2>
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
              {getSubmissions ? <ButtonSpinner /> : ''}
              {!getSubmissions && submissions.length === 0 ? (
                <p className="text-gray-400">No submissions yet.</p>
              ) : (
                submissions.map((s, i) => (
                  <li key={s.id || i} className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      //@ts-ignore  //!!!!TODO
                      setActiveSubmission(s);
                      setTab('single-submission');
                    }}
                  >
                    <p><strong>Language:</strong> {s.language}</p>
                    <p className={`ml-1 font-semibold ${s.status === 'Accepted'
                      ? 'text-green-600'
                      : 'text-red-600'
                      }`}><strong>Status: </strong>

                      {s.status}</p>
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
            <p className={` font-semibold ${activeSubmission.status === 'Accepted'
              ? 'text-green-600'
              : 'text-red-600'
              }`}><strong>Status:</strong> {activeSubmission.status}</p>
            <p><strong>Submitted At:</strong> {new Date(activeSubmission.createdAt).toLocaleString()}</p>
            <div>
              <span className="font-bold ">Time: </span>{' '}
              {activeSubmission.time ? `${activeSubmission.time} sec` : 'N/A'}
            </div>
            <div>
              <span className="font-bold ">Memory: </span>{' '}
              {activeSubmission.memory ? `${activeSubmission.memory} KB` : 'N/A'}
            </div>
            <div>
              <span className="font-bold">Token: </span>{' '}
              {activeSubmission.token}
            </div>
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
            value={language.id}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedLanguage = problem.languages.find((l) => l.id === Number(selectedId)) || language;
              setLanguage(selectedLanguage);
            }}
            className="border px-2 py-1 rounded"
          >
            {problem.languages.map(l => {
              if (l.is_archived) return;
              return <option className="bg-black text-white" value={l.id} key={l.id}>
                {l.name}
              </option>
            })}
          </select>
        </div>

        {/* <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Write your code here..."
          className="flex-grow border rounded p-3 font-mono text-sm mb-4 resize-none border-gray-300 hover:border-gray-400"
          style={{ minHeight: '300px' }}
        /> */}
        <CodeEditor code={code} setCode={setCode} />
        <Button className='m-1' onClick={handleSubmit} disabled={submitting}>{submitting ? <ButtonSpinner /> : 'Submit Code'} </Button>
      </div>
    </div>
  );
};

export default ProblemClient;

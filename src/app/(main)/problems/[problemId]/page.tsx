'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const Page = () => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('cpp')
  const params = useParams();
  const problemId = params.problemId;
  // console.log(problemId)
  const [problem, setProblem] = useState<{ problem: { title: string, description: string, }, testCases: Array<{ input: string, output: string }>, languages: [{id: string, name: string}] }>();
  useEffect(() => {
    async function init() {
      try {
        const { data } = await axios.get(`/api/problems/${problemId}`);
        if (!data.success) {
          toast(data?.error)
        } else {
          setProblem(data?.problem);

        }
      } catch (error) {
        console.log(error)
      }

    }
    init();
  }, [])

  const sampleProblem = {
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
    constraints: ['Only one valid answer exists.', 'You may not use the same element twice.'],
    testCases: [
      { input: '[2,7,11,15], target = 9', output: '[0,1]' },
      { input: '[3,2,4], target = 6', output: '[1,2]' },
    ],
  }

  const handleSubmit = async () => {
    const payload = {
      code,
      language,
      problemId: 'two-sum', // example
    }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await res.json()
      console.log('Submission Result:', result)
      alert('Code submitted!')
    } catch (err) {
      console.error(err)
    }
  }

  if (problem)
    return (
      <div className="flex flex-col sm:flex-row w-full h-screen px-4 sm:px-12 py-6 gap-6">
        {/* LEFT PANEL: Problem Description */}
        <div className="w-full sm:w-1/2  rounded-xl shadow-md p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">{problem?.problem?.title}</h1>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{problem?.problem?.description}</p>

          {/* <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Constraints</h2>
          <ul className="list-disc ml-6 text-gray-600">
            {sampleProblem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div> */}

          <div>
            <h2 className="text-lg font-semibold mb-2">Sample Test Cases</h2>
            <ul className="space-y-3">
              {problem?.testCases.map((tc, i) => (
                <li key={i} className=" rounded p-2">
                  <p><span className="font-semibold">Input:</span> {tc.input}</p>
                  <p><span className="font-semibold">Output:</span> {tc.output}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL: Code Editor */}
        <div className="w-full sm:w-1/2 flex flex-col  rounded-xl shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              {
                problem.languages?.map( l => {
                  return <option onClick={()=>setLanguage(l.id)} key={l.id}>{l.name}</option>
                })
              }
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
    )
}

export default Page

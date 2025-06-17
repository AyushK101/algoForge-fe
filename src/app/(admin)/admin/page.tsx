'use client'

import React, { useState } from 'react'
import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'

const Page = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [testCases, setTestCases] = useState([{ input: '', output: '' }])
  const [difficulty, setDifficulty] = useState('easy')


  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }])
  }

  const removeTestCase = (index: number) => {
    const updated = [...testCases]
    updated.splice(index, 1)
    setTestCases(updated)
  }

  async function submitProblem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const payload = {
      title,
      description,
      testCases,
      difficulty
    }
    const res = await axios.post('/api/admin/problem', payload, {
      withCredentials: true,
      headers: {
        'X-admin-request': 'true'
      }
    })

    if (res.data.error) {
      toast(res.data.error);
    } else {
      toast(res.data.message);
      setDescription('')
      setTestCases([])
      setTitle('')
      setDifficulty('easy')
    }



    // Replace this with DB/API logic (e.g., POST to route)
    // console.log('Submitting Problem:', payload)
    // alert('Problem submitted successfully (check console)')
  }

  return (
    <Container className='sm:pt-20'>
      <h1 className="text-2xl font-bold mb-6">Create New Problem</h1>
      <form onSubmit={submitProblem} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="border px-3 py-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        {/* Difficulty */}
        <div>
          <label className="block font-medium ">Difficulty</label>
          <select
            className="border px-3 py-2 w-full rounded"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option className='bg-black text-white' value="easy">Easy</option>
            <option className='bg-black text-white' value="medium">Medium</option>
            <option className='bg-black text-white' value="hard">Hard</option>
          </select>
        </div>


        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="border px-3 py-2 w-full rounded"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Test Cases */}
        <div>
          <label className="block font-medium mb-2">Test Cases</label>
          {testCases.map((tc, index) => (
            <div key={index} className="flex items-start space-x-2 mb-4">
              <div className="flex-1">
                <input
                  placeholder="Input"
                  className="border px-3 py-2 w-full rounded mb-2"
                  value={tc.input}
                  onChange={(e) => {
                    const updated = [...testCases]
                    updated[index].input = e.target.value
                    setTestCases(updated)
                  }}
                />
                <input
                  placeholder="Expected Output"
                  className="border px-3 py-2 w-full rounded"
                  value={tc.output}
                  onChange={(e) => {
                    const updated = [...testCases]
                    updated[index].output = e.target.value
                    setTestCases(updated)
                  }}
                />
              </div>
              <Button
                variant="destructive"
                type="button"
                onClick={() => removeTestCase(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" onClick={addTestCase}>
            + Add Test Case
          </Button>
        </div>

        {/* Submit */}
        <div>
          <Button type="submit">Submit Problem</Button>
        </div>
      </form>
    </Container>
  )
}

export default Page

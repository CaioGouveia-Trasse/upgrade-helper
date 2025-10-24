import { useEffect, useState } from 'react'
import { parseDiff } from 'react-diff-view'
import type { File } from 'gitdiff-parser'
import { getDiffURL } from '../utils'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const movePackageJsonToTop = (parsedDiff: File[]) =>
  parsedDiff.sort(({ newPath }) => (newPath.includes('package.json') ? -1 : 1))

interface UseFetchDiffProps {
  shouldShowDiff: boolean
  packageName: string
  language: string
  fromVersion: string
  toVersion: string
}
export const useFetchDiff = ({
  shouldShowDiff,
  packageName,
  language,
  fromVersion,
  toVersion,
}: UseFetchDiffProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [diff, setDiff] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiff = async () => {
      setIsLoading(true)
      setIsDone(false)
      setError(null)

      try {
        const diffURL = getDiffURL({ packageName, language, fromVersion, toVersion })

        const [response] = await Promise.all([
          fetch(diffURL),
          delay(300),
        ])

        if (!response.ok) {
          const errorMessage = `Failed to fetch diff: ${response.status} ${response.statusText}`
          console.error(errorMessage)
          console.error('URL:', diffURL)
          setError(errorMessage)
          setIsLoading(false)
          setIsDone(true)
          return
        }

        const diffText = await response.text()

        setDiff(movePackageJsonToTop(parseDiff(diffText)))

        setIsLoading(false)
        setIsDone(true)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        console.error('Error fetching diff:', errorMessage)
        setError(errorMessage)
        setIsLoading(false)
        setIsDone(true)
      }
    }

    if (shouldShowDiff) {
      fetchDiff()
    }
  }, [shouldShowDiff, packageName, language, fromVersion, toVersion])

  return {
    isLoading,
    isDone,
    diff,
    error,
  }
}

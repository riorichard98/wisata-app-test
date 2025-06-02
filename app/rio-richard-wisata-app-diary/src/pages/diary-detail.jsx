import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { getDiaryContentById } from '../../../../api/cms';

function DiaryDetail() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [diary, setDiary] = useState(null);
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await getDiaryContentById(id)
                const diary = response.content[0]
                setDiary(diary)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError("An unknown error occurred")
                }
            } finally {
                setLoading(false)
            }
        }
        if (id) {
            fetchDetail()
        }
    }, [id])
    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="p-4 text-red-500 text-center">Error: {error}</div>
            ) : (
                <div className="max-w-3xl mx-auto p-6">
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/diaries')}
                        className="mb-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-gray rounded"
                    >
                        ← Back to Diaries
                    </button>
                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-4">{diary.meta?.title}</h1>

                    {/* Meta image */}
                    {diary.meta?.image && (
                        <img
                            src={diary.meta.image}
                            alt="Diary cover"
                            className="w-full h-auto rounded-xl mb-6 shadow-md"
                        />
                    )}

                    {/* Created date */}
                    <p className="text-sm text-gray-500 mb-2">
                        {new Date(diary.created_dt).toLocaleString('id-ID', {
                            dateStyle: 'long',
                            timeStyle: 'short',
                        })}
                    </p>

                    {/* Status */}
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded mb-6">
                        {diary.status}
                    </span>

                    {/* Markdown content */}
                    <div className="prose prose-lg max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {diary.content}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DiaryDetail
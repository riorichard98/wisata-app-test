import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDiaryFeed } from '../../../../api/cms';

function DiariesFeed() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [diaries, setDiaries] = useState([]);
    const navigateToDetail = (id) => {
        navigate(`/diary/${id}`)
    }
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await getDiaryFeed()
                const diaries = response.content.map(item => ({
                    id: item.id,
                    title: item.meta.title,
                    thumbnail: item.meta.image,
                    description: item.meta.description
                }))
                setDiaries(diaries)
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
        fetchContent()
    }, [])
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
                Rio Richard Diaries
            </h1>
            {
                loading ? (
                    <div className="flex justify-center items-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 text-red-500">Error: {error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                        {diaries.map((diary, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigateToDetail(diary.id)}
                            >
                                <img
                                    src={diary.thumbnail}
                                    alt={diary.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-2">{diary.title}</h2>
                                    <p className="text-gray-600 text-sm">{diary.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default DiariesFeed

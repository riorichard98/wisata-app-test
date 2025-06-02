import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DiariesFeed from './pages/diaries-feed';
import DiaryDetail from './pages/diary-detail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={'/diaries'} replace />} />
        <Route path="/diaries" element={<DiariesFeed />} />
        <Route path="/diary/:id" element={<DiaryDetail />} />
      </Routes>
    </Router>
  )
}

export default App

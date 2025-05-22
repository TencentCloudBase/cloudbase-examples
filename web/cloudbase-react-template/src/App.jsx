import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import cloudbase from './utils/cloudbase'
import HomePage from './pages/HomePage'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初始化登录
    const initAuth = async () => {
      try {
        console.log('开始登录...');
        await cloudbase.ensureLogin()
        console.log('登录成功');
        setIsLoggedIn(true)
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        console.log('设置loading状态为false');
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="ml-2">加载中...</p>
      </div>
    )
  }

  console.log('渲染主应用UI');
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* 可以在这里添加新的路由 */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header  from './components/Header';
import { ToastProvider } from './context/ToastContext';

import Dashboard from './pages/Dashboard';
import Students  from './pages/Students';
import Teachers  from './pages/Teachers';
import Library   from './pages/Library';
import Attendance from './pages/Attendance';
import Accounts  from './pages/Accounts';
import Notice    from './pages/Notice';
import {
  ClassPage, SubjectPage, RoutinePage,
  ExamPage, TransportPage, HostelPage,
} from './pages/Placeholders';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-layout">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div className="main-content">
            <Header setSidebarOpen={setSidebarOpen} />
            <div className="fade-in">
              <Routes>
                <Route path="/"           element={<Dashboard />} />
                <Route path="/students"   element={<Students />} />
                <Route path="/teachers"   element={<Teachers />} />
                <Route path="/library"    element={<Library />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/accounts"   element={<Accounts />} />
                <Route path="/notice"     element={<Notice />} />
                <Route path="/class"      element={<ClassPage />} />
                <Route path="/subject"    element={<SubjectPage />} />
                <Route path="/routine"    element={<RoutinePage />} />
                <Route path="/exam"       element={<ExamPage />} />
                <Route path="/transport"  element={<TransportPage />} />
                <Route path="/hostel"     element={<HostelPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

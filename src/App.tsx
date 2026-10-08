import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeadModalProvider } from './components/LeadModal';
import HomePage from './pages/HomePage';
import ZhkPage from './pages/ZhkPage';

function App() {
  return (
    <BrowserRouter basename="/dev34-react">
      <LeadModalProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/zhk/:slug" element={<ZhkPage />} />
        </Routes>
      </LeadModalProvider>
    </BrowserRouter>
  );
}

export default App;

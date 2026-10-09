import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeadModalProvider } from './components/LeadModal';
import HomePage from './pages/HomePage';

// Страница ЖК грузится отдельным чанком — большинство заходов начинается
// с главной, и ей незачем тянуть код страницы конкретного комплекса.
const ZhkPage = lazy(() => import('./pages/ZhkPage'));

function App() {
  return (
    <BrowserRouter basename="/dev34-react">
      <LeadModalProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/zhk/:slug" element={<ZhkPage />} />
          </Routes>
        </Suspense>
      </LeadModalProvider>
    </BrowserRouter>
  );
}

export default App;

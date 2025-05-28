import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { InsightProvider } from './contexts/InsightContext.tsx';

createRoot(document.getElementById("root")!).render(
  <InsightProvider>
<App />
  </InsightProvider>
);

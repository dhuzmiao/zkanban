import { Dashboard } from '@/components';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;

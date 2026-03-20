import { useSelector } from 'react-redux';
import { cn } from '../../utils/helpers';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function PageContainer({ children, title, subtitle }) {
    const { sidebarOpen } = useSelector((state) => state.ui);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Navbar />
            <Sidebar />
            <main
                className={cn(
                    'pt-16 min-h-screen transition-all duration-300',
                    sidebarOpen ? 'ml-64' : 'ml-0'
                )}
            >
                <div className="p-6 lg:p-8">
                    {(title || subtitle) && (
                        <div className="mb-8">
                            {title && <h1 className="text-2xl lg:text-3xl font-bold text-white">{title}</h1>}
                            {subtitle && <p className="mt-1 text-slate-400">{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
}

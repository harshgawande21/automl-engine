
export default function Footer() {
    return (
        <footer className="border-t border-slate-700/50 bg-slate-900/60 backdrop-blur-sm py-4 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} AutoInsight. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-slate-300 transition-colors">Documentation</a>
                    <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
                    <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
                </div>
            </div>
        </footer>
    );
}

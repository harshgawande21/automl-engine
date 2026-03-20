import { Route, Routes } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Pages
import ForgotPassword from '../pages/Auth/ForgotPassword';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ResetPassword from '../pages/Auth/ResetPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import DataProcessing from '../pages/Data/DataProcessing';
import DataUpload from '../pages/Data/DataUpload';
import DatasetPreview from '../pages/Data/DatasetPreview';
import DetailedEDA from '../pages/Data/DetailedEDA';
import ExplainabilityDashboard from '../pages/Explainability/ExplainabilityDashboard';
import Home from '../pages/Landing/Home';
import HyperparameterTuning from '../pages/Model/HyperparameterTuning';
import ModelEvaluation from '../pages/Model/ModelEvaluation';
import ModelTraining from '../pages/Model/ModelTraining';
import MonitoringDashboard from '../pages/Monitoring/MonitoringDashboard';
import NotFound from '../pages/NotFound';
import PredictBatch from '../pages/Prediction/PredictBatch';
import PredictSingle from '../pages/Prediction/PredictSingle';
import PredictionResults from '../pages/Prediction/PredictionResults';
import Settings from '../pages/Settings/Settings';
import AnalyticsDashboard from '../pages/Visualization/AnalyticsDashboard';

// Layout component that includes Navbar
function LayoutWithNavbar({ children }) {
    return (
        <>
            <Navbar />
            <div className="pt-16">
                {children}
            </div>
        </>
    );
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes with Navbar */}
            <Route path="/" element={
                <LayoutWithNavbar>
                    <Home />
                </LayoutWithNavbar>
            } />
            <Route path="/login" element={
                <LayoutWithNavbar>
                    <Login />
                </LayoutWithNavbar>
            } />
            <Route path="/register" element={
                <LayoutWithNavbar>
                    <Register />
                </LayoutWithNavbar>
            } />
            <Route path="/forgot-password" element={
                <LayoutWithNavbar>
                    <ForgotPassword />
                </LayoutWithNavbar>
            } />
            <Route path="/reset-password" element={
                <LayoutWithNavbar>
                    <ResetPassword />
                </LayoutWithNavbar>
            } />

            {/* Protected Routes with Navbar */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={
                    <LayoutWithNavbar>
                        <Dashboard />
                    </LayoutWithNavbar>
                } />
                <Route path="/data/upload" element={
                    <LayoutWithNavbar>
                        <DataUpload />
                    </LayoutWithNavbar>
                } />
                <Route path="/data/preview" element={
                    <LayoutWithNavbar>
                        <DatasetPreview />
                    </LayoutWithNavbar>
                } />
                <Route path="/data/detailed-eda" element={
                    <LayoutWithNavbar>
                        <DetailedEDA />
                    </LayoutWithNavbar>
                } />
                <Route path="/data/processing" element={
                    <LayoutWithNavbar>
                        <DataProcessing />
                    </LayoutWithNavbar>
                } />
                <Route path="/model/training" element={
                    <LayoutWithNavbar>
                        <ModelTraining />
                    </LayoutWithNavbar>
                } />
                <Route path="/model/tuning" element={
                    <LayoutWithNavbar>
                        <HyperparameterTuning />
                    </LayoutWithNavbar>
                } />
                <Route path="/model/evaluation" element={
                    <LayoutWithNavbar>
                        <ModelEvaluation />
                    </LayoutWithNavbar>
                } />
                <Route path="/prediction/single" element={
                    <LayoutWithNavbar>
                        <PredictSingle />
                    </LayoutWithNavbar>
                } />
                <Route path="/prediction/batch" element={
                    <LayoutWithNavbar>
                        <PredictBatch />
                    </LayoutWithNavbar>
                } />
                <Route path="/prediction/results" element={
                    <LayoutWithNavbar>
                        <PredictionResults />
                    </LayoutWithNavbar>
                } />
                <Route path="/explainability" element={
                    <LayoutWithNavbar>
                        <ExplainabilityDashboard />
                    </LayoutWithNavbar>
                } />
                <Route path="/monitoring" element={
                    <LayoutWithNavbar>
                        <MonitoringDashboard />
                    </LayoutWithNavbar>
                } />
                <Route path="/analytics" element={
                    <LayoutWithNavbar>
                        <AnalyticsDashboard />
                    </LayoutWithNavbar>
                } />
                <Route path="/settings" element={
                    <LayoutWithNavbar>
                        <Settings />
                    </LayoutWithNavbar>
                } />
            </Route>

            {/* 404 Fallback with Navbar */}
            <Route path="*" element={
                <LayoutWithNavbar>
                    <NotFound />
                </LayoutWithNavbar>
            } />
        </Routes>
    );
}

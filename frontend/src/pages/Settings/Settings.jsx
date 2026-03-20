import { Bell, Eye, EyeOff, LogOut, Palette, Save, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';

export default function Settings() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Form states
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        organization: '',
        role: ''
    });
    
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette }
    ];

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.updateProfile(profileForm);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await authService.updatePassword(passwordForm);
            setMessage('Password updated successfully!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-blue-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                        <p className="text-slate-600">Manage your account settings</p>
                    </div>
                    <Button 
                        variant="outline" 
                        icon={LogOut}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <div className="p-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {message && (
                            <div className={`p-4 rounded-lg mb-6 ${
                                message.includes('success') 
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                                {message}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                </CardHeader>
                                <div className="p-6">
                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <InputField
                                            label="Name"
                                            name="name"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                            placeholder="Enter your name"
                                        />
                                        <InputField
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                            placeholder="Enter your email"
                                        />
                                        <InputField
                                            label="Organization"
                                            name="organization"
                                            value={profileForm.organization}
                                            onChange={(e) => setProfileForm({...profileForm, organization: e.target.value})}
                                            placeholder="Enter your organization"
                                        />
                                        <SelectField
                                            label="Role"
                                            name="role"
                                            value={profileForm.role}
                                            onChange={(e) => setProfileForm({...profileForm, role: e.target.value})}
                                            options={[
                                                { value: '', label: 'Select role' },
                                                { value: 'admin', label: 'Administrator' },
                                                { value: 'user', label: 'User' },
                                                { value: 'analyst', label: 'Data Analyst' }
                                            ]}
                                        />
                                        <Button 
                                            type="submit" 
                                            loading={loading}
                                            icon={Save}
                                        >
                                            Save Changes
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                </CardHeader>
                                <div className="p-6">
                                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                        <InputField
                                            label="Current Password"
                                            name="currentPassword"
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                            placeholder="Enter current password"
                                            icon={showCurrentPassword ? EyeOff : Eye}
                                            onIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        />
                                        <InputField
                                            label="New Password"
                                            name="newPassword"
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                            placeholder="Enter new password"
                                            icon={showNewPassword ? EyeOff : Eye}
                                            onIconClick={() => setShowNewPassword(!showNewPassword)}
                                        />
                                        <InputField
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                            placeholder="Confirm new password"
                                            icon={showConfirmPassword ? EyeOff : Eye}
                                            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        />
                                        <Button 
                                            type="submit" 
                                            loading={loading}
                                            icon={Save}
                                        >
                                            Update Password
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                </CardHeader>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-4 bg-white/50 border border-blue-200 rounded-lg">
                                            <div>
                                                <div className="font-medium text-slate-800">Email Notifications</div>
                                                <div className="text-sm text-slate-600">Receive email updates about your account</div>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                                        </label>
                                        <label className="flex items-center justify-between p-4 bg-white/50 border border-blue-200 rounded-lg">
                                            <div>
                                                <div className="font-medium text-slate-800">Training Notifications</div>
                                                <div className="text-sm text-slate-600">Get notified when model training completes</div>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                                        </label>
                                        <label className="flex items-center justify-between p-4 bg-white/50 border border-blue-200 rounded-lg">
                                            <div>
                                                <div className="font-medium text-slate-800">Security Alerts</div>
                                                <div className="text-sm text-slate-600">Important security notifications</div>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                                        </label>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'appearance' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Appearance Settings</CardTitle>
                                </CardHeader>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                                            <SelectField
                                                name="theme"
                                                defaultValue="light"
                                                options={[
                                                    { value: 'light', label: 'Light Theme' },
                                                    { value: 'dark', label: 'Dark Theme' },
                                                    { value: 'auto', label: 'Auto (System)' }
                                                ]}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                                            <SelectField
                                                name="language"
                                                defaultValue="en"
                                                options={[
                                                    { value: 'en', label: 'English' },
                                                    { value: 'es', label: 'Spanish' },
                                                    { value: 'fr', label: 'French' },
                                                    { value: 'de', label: 'German' }
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

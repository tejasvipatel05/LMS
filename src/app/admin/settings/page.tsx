'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface SystemSettings {
  general: {
    libraryName: string
    address: string
    phone: string
    email: string
    workingHours: string
  }
  borrowing: {
    defaultLoanPeriod: number
    maxRenewals: number
    finePerDay: number
    maxBooksPerUser: number
    reservationExpiry: number
  }
  notifications: {
    enableEmailNotifications: boolean
    reminderDays: number
    overdueReminderDays: number
  }
  security: {
    passwordMinLength: number
    sessionTimeout: number
    requireEmailVerification: boolean
  }
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      libraryName: 'Central Public Library',
      address: '123 Library Street, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@library.com',
      workingHours: '9:00 AM - 6:00 PM'
    },
    borrowing: {
      defaultLoanPeriod: 14,
      maxRenewals: 2,
      finePerDay: 0.50,
      maxBooksPerUser: 5,
      reservationExpiry: 3
    },
    notifications: {
      enableEmailNotifications: true,
      reminderDays: 3,
      overdueReminderDays: 7
    },
    security: {
      passwordMinLength: 6,
      sessionTimeout: 30,
      requireEmailVerification: false
    }
  })

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'borrowing', name: 'Borrowing Rules', icon: '📚' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'backup', name: 'Backup & Maintenance', icon: '💾' }
  ]

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // This would typically save to an API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const resetToDefaults = () => {
    if (confirm('Reset all settings to default values? This cannot be undone.')) {
      setSettings({
        general: {
          libraryName: 'Central Public Library',
          address: '123 Library Street, City, State 12345',
          phone: '(555) 123-4567',
          email: 'info@library.com',
          workingHours: '9:00 AM - 6:00 PM'
        },
        borrowing: {
          defaultLoanPeriod: 14,
          maxRenewals: 2,
          finePerDay: 0.50,
          maxBooksPerUser: 5,
          reservationExpiry: 3
        },
        notifications: {
          enableEmailNotifications: true,
          reminderDays: 3,
          overdueReminderDays: 7
        },
        security: {
          passwordMinLength: 6,
          sessionTimeout: 30,
          requireEmailVerification: false
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="mt-2 text-gray-600">Configure your library management system</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={resetToDefaults}>
            🔄 Reset to Defaults
          </Button>
          <Button variant="primary" onClick={saveSettings} disabled={loading}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              '💾 Save Settings'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">General Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Library Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.libraryName}
                        onChange={(e) => handleInputChange('general', 'libraryName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.general.email}
                        onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.general.phone}
                        onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Hours
                      </label>
                      <input
                        type="text"
                        value={settings.general.workingHours}
                        onChange={(e) => handleInputChange('general', 'workingHours', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={settings.general.address}
                        onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Borrowing Rules */}
            {activeTab === 'borrowing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Borrowing Rules</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Loan Period (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={settings.borrowing.defaultLoanPeriod}
                        onChange={(e) => handleInputChange('borrowing', 'defaultLoanPeriod', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Renewals
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={settings.borrowing.maxRenewals}
                        onChange={(e) => handleInputChange('borrowing', 'maxRenewals', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fine Per Day ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.borrowing.finePerDay}
                        onChange={(e) => handleInputChange('borrowing', 'finePerDay', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Books Per User
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.borrowing.maxBooksPerUser}
                        onChange={(e) => handleInputChange('borrowing', 'maxBooksPerUser', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reservation Expiry (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={settings.borrowing.reservationExpiry}
                        onChange={(e) => handleInputChange('borrowing', 'reservationExpiry', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Email Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableNotifications"
                        checked={settings.notifications.enableEmailNotifications}
                        onChange={(e) => handleInputChange('notifications', 'enableEmailNotifications', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableNotifications" className="ml-2 text-sm text-gray-700">
                        Enable Email Notifications
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reminder Days Before Due
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={settings.notifications.reminderDays}
                          onChange={(e) => handleInputChange('notifications', 'reminderDays', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Overdue Reminder Days
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.notifications.overdueReminderDays}
                          onChange={(e) => handleInputChange('notifications', 'overdueReminderDays', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Password Length
                        </label>
                        <input
                          type="number"
                          min="4"
                          max="20"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="480"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requireEmailVerification"
                        checked={settings.security.requireEmailVerification}
                        onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requireEmailVerification" className="ml-2 text-sm text-gray-700">
                        Require Email Verification for New Users
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backup & Maintenance */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Database Backup & Maintenance</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4 border-l-4 border-blue-500">
                      <h3 className="font-medium text-gray-900 mb-2">💾 Database Backup</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Create a backup of your library database
                      </p>
                      <Button variant="secondary" onClick={() => alert('Starting database backup...')}>
                        Create Backup
                      </Button>
                    </Card>

                    <Card className="p-4 border-l-4 border-green-500">
                      <h3 className="font-medium text-gray-900 mb-2">🗂️ Data Export</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Export library data to various formats
                      </p>
                      <Button variant="secondary" onClick={() => alert('Exporting data...')}>
                        Export Data
                      </Button>
                    </Card>

                    <Card className="p-4 border-l-4 border-yellow-500">
                      <h3 className="font-medium text-gray-900 mb-2">🧹 Clean Up</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Remove old logs and temporary files
                      </p>
                      <Button variant="secondary" onClick={() => alert('Starting cleanup...')}>
                        Clean System
                      </Button>
                    </Card>

                    <Card className="p-4 border-l-4 border-purple-500">
                      <h3 className="font-medium text-gray-900 mb-2">🔍 System Check</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Run comprehensive system diagnostics
                      </p>
                      <Button variant="secondary" onClick={() => alert('Running system check...')}>
                        Run Diagnostics
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
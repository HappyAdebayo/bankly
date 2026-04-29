'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Check,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { updateKYCStatus, getUserData, UserData } from '@/lib/dashboard-utils';

export default function KYCPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', fileUploaded: false });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    // Initialize form with existing name if available
    if (data.kycDetails?.fullName) {
      setFormData({ ...formData, fullName: data.kycDetails.fullName });
    }
    setLoading(false);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData.fileUploaded) {
      newErrors.fileUploaded = 'Please upload your ID document';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, fileUploaded: true });
      setErrors({ ...errors, fileUploaded: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update KYC status
    const updated = updateKYCStatus(formData.fullName, true, 'pending');
    setUserData(updated);
    setSuccess(true);
    setSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSuccess(false);
      setShowForm(false);
    }, 3000);
  };

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const kycStatusInfo = {
    pending: {
      icon: <Clock className="w-12 h-12" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Verification Pending',
      description: 'Your KYC is being reviewed. This typically takes 24-48 hours.',
      step: 'Step 1 of 2',
    },
    verified: {
      icon: <CheckCircle2 className="w-12 h-12" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'Verified',
      description: 'Your account is fully verified. You can now use all features.',
      step: 'Complete',
    },
    rejected: {
      icon: <XCircle className="w-12 h-12" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'Verification Failed',
      description:
        'Your KYC submission was rejected. Please resubmit with correct documents.',
      step: 'Action Required',
    },
    'not created': {
      icon: <AlertCircle className="w-12 h-12" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      title: 'Not Started',
      description: 'Please complete your identity verification to unlock all features.',
      step: 'Not Started',
    },
  };

  const status = kycStatusInfo[userData.kycStatus as keyof typeof kycStatusInfo] || kycStatusInfo['not created'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Know Your Customer (KYC)</h1>
          <p className="text-muted-foreground">
            Complete your identity verification
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card
        className={`p-6 ${status.bgColor} border ${status.borderColor}`}
      >
        <div className="flex items-start gap-4">
          <div className={status.color}>{status.icon}</div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className={`text-lg font-bold ${status.color}`}>
                {status.title}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} bg-white bg-opacity-60`}
              >
                {status.step}
              </span>
            </div>
            <p className="text-sm text-foreground">{status.description}</p>

            {userData.kycDetails && (
              <div className="mt-4 pt-4 border-t border-current opacity-30">
                <p className="text-xs">
                  Submitted on: {userData.kycDetails.submittedAt}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* KYC Information Card */}
      {userData.kycDetails && userData.kycStatus !== 'rejected' && !showForm && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">{userData.kycDetails.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">ID Document</p>
                <p className="font-medium">
                  {userData.kycDetails.idUploaded
                    ? 'Uploaded'
                    : 'Not Uploaded'}
                </p>
              </div>
            </div>

            {userData.kycStatus === 'pending' && (
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="w-full"
              >
                Update Information
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Form Section */}
      {showForm || userData.kycStatus === 'rejected' || !userData.kycDetails ? (
        <Card className="p-6">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-600">
                KYC Submitted!
              </h2>
              <p className="text-muted-foreground">
                Your KYC information has been submitted for review. You&apos;ll
                be notified once verification is complete.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
              {/* Warning Alert */}
              {userData.kycStatus === 'rejected' && (
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">
                      Please resubmit your KYC
                    </p>
                    <p className="text-sm text-red-700">
                      Your previous submission was rejected. Please provide
                      valid documents.
                    </p>
                  </div>
                </div>
              )}

              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  placeholder="John Alexander Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload ID Document</label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">📄</div>
                      <p className="font-medium text-sm">
                        {formData.fileUploaded
                          ? 'ID Document Selected'
                          : 'Click to upload ID'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Passport, Driver&apos;s License, or National ID
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {errors.fileUploaded && (
                  <p className="text-sm text-red-500">{errors.fileUploaded}</p>
                )}
              </div>

              {/* Information Notice */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Privacy Notice:</strong> Your personal information is
                  encrypted and processed according to banking regulations. We
                  never share your data with third parties.
                </p>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Submitting...' : 'Submit KYC'}
              </Button>
            </form>
          )}
        </Card>
      ) : null}

      {/* Features Card */}
      {userData.kycStatus === 'verified' && (
        <Card className="p-6 bg-green-50 border border-green-200">
          <h2 className="font-semibold mb-4 text-green-900">
            Unlocked Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Transfer Money',
              'Withdraw Money',
              'Create Savings Goals',
              'Full Account Access',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

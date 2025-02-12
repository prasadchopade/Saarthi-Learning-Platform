import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Footer from '../../components/Common/Footer';

const PrivacyPolicyPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };
  const lastUpdated = 'August 27, 2025';
  const effectiveDate = 'August 27, 2025';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          
          <div className="text-sm text-gray-600 mb-8 bg-gray-50 p-4 rounded-lg">
            <p><strong>Effective Date:</strong> {effectiveDate}</p>
            <p><strong>Last Updated:</strong> {lastUpdated}</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy describes how [Company Name] ("we," "us," or "our") collects, uses, and shares your personal information when you use our educational platform and related services (the "Service"). By using our Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Account Information:</strong> Name, email address, username, password, and profile information</li>
                <li><strong>Educational Data:</strong> Learning preferences, course selections, progress tracking, and academic records</li>
                <li><strong>Communication Data:</strong> Messages, feedback, support requests, and survey responses</li>
                <li><strong>API Keys:</strong> Third-party service credentials for AI integrations (encrypted and used only for service provision for you.)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.2 Information We Collect Automatically</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Usage Data:</strong> Pages viewed, time spent, features used, learning activities, and interaction patterns</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and mobile network information</li>
                <li><strong>Log Data:</strong> Server logs, error reports, and system performance data</li>
                <li><strong>Cookies and Tracking Technologies:</strong> Session cookies, preference cookies, and analytics cookies</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.3 Information from Third Parties</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Google Analytics for usage data</li>
                <li>Google Authentication for authentication purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Provision:</strong> Deliver educational content, track progress, and provide personalized learning experiences</li>
                <li><strong>AI Features:</strong> Process requests through AI services, generate personalized recommendations, and enhance learning outcomes</li>
                <li><strong>Account Management:</strong> Create and maintain your account, authenticate users, and provide customer support</li>
                <li><strong>Communication:</strong> Send service updates, educational content, promotional materials, and respond to inquiries</li>
                <li><strong>Analytics and Improvement:</strong> Analyze usage patterns, improve our services, and develop new features</li>
                <li><strong>Legal Compliance:</strong> Comply with legal obligations, enforce our terms, and protect our rights</li>
                <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. How We Share Your Information</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Service Providers</h3>
              <p className="text-gray-700 mb-3">
                We share information with third-party service providers who perform services on our behalf, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li>Cloud hosting and storage providers for storing your data</li>
                <li>AI and machine learning service providers for providing AI features</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 Educational Institutions</h3>
              <p className="text-gray-700 mb-4">
                If you access our Service through an educational institution, we may share your educational data with that institution as permitted by applicable law and your consent.
                We can also share analytics data with any educational institution for improving our services and for research purposes.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.3 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, safety, and the safety of others.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.4 Business Transfers</h3>
              <p className="text-gray-700">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-3">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Encryption of data at rest using industry-standard protocols</li>
                <li>Multi-factor authentication and role-based access controls</li>
               </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Account data is typically retained for the duration of your account plus 3 years after closure. Usage data may be retained in aggregated, anonymized form for analytical purposes. You may request deletion of your data as described in the "Your Rights" section below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">7.1 Access and Control</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Rectification:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">7.2 Communication Preferences</h3>
              <p className="text-gray-700 mb-4">
                You can opt out of promotional communications by following the unsubscribe instructions in emails or updating your account preferences. Note that you cannot opt out of service-related communications.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">7.3 Cookie Controls</h3>
              <p className="text-gray-700">
                Most browsers allow you to control cookies through their settings. Disabling certain cookies may limit your ability to use some features of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be processed in countries other than your own, including the United States and other jurisdictions where our service providers operate. We do not guarantee the security of your data in transit.
              </p>
            </section>

           
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will post the updated policy on this page and update the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-3">
                If you have questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> founder@saarthi.xyz</p>
             </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Definitions</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>"Personal Information"</strong> means information that identifies, relates to, or could reasonably be linked with you or your household.</li>
                <li><strong>"Processing"</strong> means any operation performed on personal information, including collection, use, storage, disclosure, and deletion.</li>
                <li><strong>"Service Provider"</strong> means a third party that processes personal information on our behalf for a business purpose.</li>
                <li><strong>"Sensitive Personal Information"</strong> includes precise geolocation, racial or ethnic origin, religious beliefs, health data, biometric identifiers, and other categories defined by applicable law.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
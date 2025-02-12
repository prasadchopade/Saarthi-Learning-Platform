import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Footer from '../../components/Common/Footer';

const TermsOfServicePage = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          
          <div className="text-sm text-gray-600 mb-8 bg-gray-50 p-4 rounded-lg">
            <p><strong>Effective Date:</strong> {effectiveDate}</p>
            <p><strong>Last Updated:</strong> {lastUpdated}</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and [Company Name] ("Company," "we," "us," or "our") regarding your use of our educational platform and related services (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                By accessing, browsing, or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use our Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to students, educators, institutions, and administrators.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Our Service provides an educational platform that offers online courses, learning materials, AI-powered tutoring, progress tracking, and related educational tools. The Service may include both free and paid features, as well as integration with third-party AI services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We may also impose limits on certain features or restrict access to parts of the Service without notice or liability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 Account Security</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.3 Account Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You must be at least 13 years old to create an account. If you are under 18, you represent that your legal guardian has reviewed and agreed to these Terms. We reserve the right to refuse service, terminate accounts, or cancel subscriptions at our sole discretion.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.4 Institutional Accounts</h3>
              <p className="text-gray-700 leading-relaxed">
                Educational institutions may create accounts that allow multiple users. The institution is responsible for ensuring all users comply with these Terms and for managing user access and permissions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Permitted Uses</h3>
              <p className="text-gray-700 leading-relaxed mb-3">You may use the Service only for lawful purposes and in accordance with these Terms. Specifically, you agree to use the Service solely for:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li>Educational and learning purposes</li>
                <li>Creating, sharing, and accessing educational content</li>
                <li>Participating in learning communities and discussions</li>
                <li>Tracking your educational progress</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 Prohibited Activities</h3>
              <p className="text-gray-700 leading-relaxed mb-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations</li>
                <li>Impersonate any person or entity or falsely state your affiliation with any person or entity</li>
                <li>Upload, post, or transmit any content that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Attempt to gain unauthorized access to any portion of the Service or any other systems or networks</li>
                <li>Use any automated means to access the Service without our express written permission</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>Collect or harvest any personally identifiable information from other users</li>
                <li>Use the Service to transmit any viruses, worms, or other malicious code</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Remove, alter, or obscure any proprietary notices on the Service</li>
                <li>Use the Service for commercial purposes without our written consent</li>
                <li>Share your account credentials with others or create multiple accounts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. User Content and Conduct</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">5.1 User Content</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                "User Content" means any content, data, information, text, graphics, photos, audio, video, or other materials you upload, post, or otherwise provide to the Service. You retain ownership of your User Content, but you grant us certain rights as described below.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">5.2 License Grant</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, store, display, reproduce, modify, create derivative works from, distribute, and otherwise exploit your User Content in connection with operating and providing the Service.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">5.3 Content Standards</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You are solely responsible for your User Content and must ensure it complies with applicable laws and these Terms. Your User Content must not:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li>Infringe any intellectual property rights or other proprietary rights</li>
                <li>Contain personally identifiable information of others without consent</li>
                <li>Be false, misleading, or deceptive</li>
                <li>Violate any person's privacy or publicity rights</li>
                <li>Contain offensive, harmful, or inappropriate material</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">5.4 Content Monitoring</h3>
              <p className="text-gray-700 leading-relaxed">
                We have no obligation to monitor User Content but may do so at our discretion. We reserve the right to remove or modify any User Content that violates these Terms or that we deem inappropriate, without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. API Keys and Third-Party Services</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">6.1 API Key Usage</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Our Service may allow you to provide API keys for third-party AI services (such as Google Gemini, OpenAI, etc.). By providing these keys, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li>You have the right to use and authorize the use of these API keys</li>
                <li>You are responsible for all costs and charges associated with API usage</li>
                <li>You must comply with the terms of service of the respective API providers</li>
                <li>We will use your API keys only to provide the requested services</li>
                <li>We implement security measures but cannot guarantee absolute security</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">6.2 API Key Security</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                While we implement industry-standard security measures to protect your API keys, you acknowledge that no system is completely secure. You are responsible for monitoring your API usage and revoking keys if you suspect unauthorized use.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">6.3 Third-Party Service Disclaimers</h3>
              <p className="text-gray-700 leading-relaxed">
                We are not responsible for the availability, functionality, or content of third-party services. Your use of third-party APIs is subject to their respective terms of service and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">7.1 Our Intellectual Property</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                The Service and its original content, features, and functionality are and will remain the exclusive property of [Company Name] and its licensors. The Service is protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">7.2 Trademarks</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Our name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of [Company Name] or its affiliates. You may not use such marks without our prior written permission.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">7.3 DMCA Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                We respect intellectual property rights and respond to notices of alleged copyright infringement in accordance with the Digital Millennium Copyright Act ("DMCA"). If you believe your work has been copied in a way that constitutes copyright infringement, please contact our designated agent with the required information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Payment Terms and Subscription Services</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">8.1 Paid Services</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Some aspects of the Service may be provided for a fee. You agree to pay all fees associated with your use of paid services. All fees are non-refundable except as required by law or as specifically stated in these Terms.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">8.2 Subscription Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Subscription services automatically renew for successive periods unless canceled. You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">8.3 Price Changes</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We reserve the right to change our pricing at any time. Price changes will be communicated to you at least 30 days in advance and will take effect on your next billing cycle.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">8.4 Refund Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                Refunds may be available within 30 days of purchase for annual subscriptions, subject to our refund policy. Contact our support team to request a refund, which will be reviewed on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Your privacy is important to us. Our collection, use, and disclosure of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using the Service, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy. We may use your information to provide and improve the Service, communicate with you, and for other purposes described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Disclaimers and Warranties</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">10.1 Service Availability</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We strive to provide reliable service but cannot guarantee uninterrupted or error-free operation. The Service may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">10.2 Educational Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                While we strive to provide accurate and helpful educational content, we make no warranties about the completeness, accuracy, or effectiveness of the educational materials. Learning outcomes may vary, and we do not guarantee specific academic results.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">10.3 AS-IS Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL [COMPANY NAME], ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
              <p className="text-gray-700 leading-relaxed">
                OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to defend, indemnify, and hold harmless [Company Name] and its officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Termination</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">13.1 Termination by You</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You may terminate your account at any time by contacting us or through your account settings. Upon termination, your right to use the Service will cease immediately.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">13.2 Termination by Us</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. We may also terminate inactive accounts after a period of inactivity.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">13.3 Effect of Termination</h3>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, all licenses and rights granted to you will cease, and you must stop using the Service. We may delete your account and User Content, though some information may be retained as required by law or for legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Governing Law and Dispute Resolution</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">14.1 Governing Law</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">14.2 Dispute Resolution</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization], except that either party may seek injunctive relief in court.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">14.3 Class Action Waiver</h3>
              <p className="text-gray-700 leading-relaxed">
                You agree that disputes must be resolved on an individual basis and waive any right to participate in class action lawsuits or class-wide arbitrations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">15. General Provisions</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">15.1 Modifications to Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We reserve the right to modify these Terms at any time. We will provide notice of material changes by email or through the Service at least 30 days before the changes take effect. Your continued use of the Service after changes become effective constitutes acceptance of the new Terms.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">15.2 Severability</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">15.3 Assignment</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms without restriction.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">15.4 Entire Agreement</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service and supersede all prior agreements and understandings.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">15.5 Waiver</h3>
              <p className="text-gray-700 leading-relaxed">
                Our failure to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@[company].com</p>
                <p className="text-gray-700"><strong>Mailing Address:</strong></p>
                <p className="text-gray-700 ml-4">
                  [Company Name]<br />
                  Attn: Legal Department<br />
                  [Street Address]<br />
                  [City, State ZIP Code]
                </p>
                <p className="text-gray-700 mt-2"><strong>Phone:</strong> [Phone Number]</p>
              </div>
            </section>

            <section>
              <p className="text-sm text-gray-600 text-center mt-12 pt-8 border-t border-gray-200">
                By using our Service, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
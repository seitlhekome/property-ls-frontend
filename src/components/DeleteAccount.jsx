import React from "react";

export default function DeleteAccount() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Delete Your Property LS Account
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Last updated: 9 August 2026
        </p>

        <div className="space-y-8 text-gray-700 leading-7">
          <section>
            <p>
              Property LS allows users to request deletion of their account and
              associated personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              How to request account deletion
            </h2>

            <p className="mb-3">
              To request deletion of your Property LS account, contact Property
              LS using the contact details provided on the platform.
            </p>

            <p>
              In your request, include the email address associated with your
              Property LS account so that we can identify the correct account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What will be deleted
            </h2>

            <p className="mb-3">
              When an account deletion request is verified and completed, we
              will delete or remove access to personal information associated
              with the account, which may include:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Account profile information.</li>
              <li>Email address and contact details.</li>
              <li>Saved-property information associated with the account.</li>
              <li>
                Property listings and related content associated with the
                account, where applicable.
              </li>
              <li>
                Other personal information directly associated with the user
                account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Information that may be retained
            </h2>

            <p>
              Some limited information may be retained where reasonably
              necessary for legal, security, fraud-prevention, dispute
              resolution, or regulatory purposes. Any retained information will
              only be kept for as long as reasonably necessary for those
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Processing time
            </h2>

            <p>
              We will process verified account deletion requests within a
              reasonable period after receiving the request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Contact
            </h2>

            <p>
              If you have questions about account deletion or your personal
              data, please contact Property LS using the contact information
              available on the Property LS platform.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
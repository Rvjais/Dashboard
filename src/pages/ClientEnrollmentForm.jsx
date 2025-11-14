import React, { useState } from 'react';

const ClientEnrollmentForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    primaryEmail: '',
    phoneNumber: '',
    businessAddress: '',
    websiteUrl: '',
    gstinNumber: '',
    panNumber: '',
    state: '',
    city: '',
    pincodeRegistrationType: '',
    udyamNumber: '',
    medicalRegistration: '',
    clinicalLicence: '',
    drugLicence: '',
    nabhAccreditation: '',
    fssaiLicence: '',
    biomedicalWasteAuth: '',
    industry: '',
    healthcareBusinessType: '',
    monthlyMarketingBudget: '',
    adminPanelUrl: '',
    username: '',
    password: '',
    previousSeoReport: '',
    seoRemarks: '',
    investmentInSeoProcess: '',
    advertisingPlatforms: [],
    paidAdvertisingInvestmentLevel: '',
    adManagementInvestmentLevel: '',
    targetLocationsForAds: '',
    adRemarks: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const FormField = ({ label, name, placeholder, type = 'text', required = false, isTextarea = false }) => (
    <div className="mb-4">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
          rows="3"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
        />
      )}
    </div>
  );

  const FormSelect = ({ label, name, options, required = false }) => (
    <div className="mb-4">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
      >
        <option value="">{options.placeholder}</option>
        {options.items && options.items.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center flex-shrink-0">
          <div className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full font-semibold text-xs sm:text-sm transition-all ${
            step === i 
              ? 'bg-blue-600 text-white' 
              : step > i 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
          }`}>
            {i}
          </div>
          {i < 5 && <div className={`w-6 h-0.5 sm:w-10 flex-shrink-0 ${step > i ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        <StepIndicator />

        {/* Step 1: Basic Information & Business Details */}
        {step === 1 && (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic Information & Business Details</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                📁 File upload: <a href="#" className="text-blue-600 hover:underline break-words">Please upload max 3 files (logos, brand guidelines, marketing materials etc.)</a> to{' '}
                <a href="mailto:fileupload@domain.com" className="text-blue-600 hover:underline break-words">fileupload@domain.com</a> with your user name & file subject line.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <FormField label="Client Name" name="clientName" placeholder="Enter your business/client name" required />
              <FormField label="Primary Email" name="primaryEmail" placeholder="your@email.com" type="email" required />
              <div className="col-span-1">
                <FormField label="Phone Number" name="phoneNumber" placeholder="+1 (555) 123-4567" required />
              </div>
              <div className="col-span-1 md:col-span-2">
                <FormField label="Website URL" name="websiteUrl" placeholder="https://www.yourwebsite.com" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <FormField label="Business Address" name="businessAddress" placeholder="Full business address including city, state, and zip code" isTextarea />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-6 sm:mt-8 mb-4">Indian Business Details</h2>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 sm:p-6 rounded-md mb-6 sm:mb-8 border border-orange-100 dark:border-orange-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormField label="GSTIN (GST Identification Number)" name="gstinNumber" placeholder="22AAAAAA0000A1Z5" />
                <FormField label="PAN Number" name="panNumber" placeholder="ABCDE1234F" />
                <FormSelect
                  label="State"
                  name="state"
                  options={{ placeholder: 'Select State' }}
                />
                <FormSelect
                  label="City"
                  name="city"
                  options={{ placeholder: 'Select City' }}
                />
                <FormSelect
                  label="PIN Code Registration Type"
                  name="pincodeRegistrationType"
                  options={{ placeholder: 'Select Registration Type' }}
                />
                <FormField label="Udyam Registration Number (MSME)" name="udyamNumber" placeholder="UDYAM-XX-00-000000" />
              </div>
            </div>

            <div className="flex justify-end gap-3 sm:gap-4">
              <button
                type="button"
                onClick={nextStep}
                className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 2: Healthcare Licenses & Registrations */}
        {step === 2 && (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Healthcare Licenses & Registrations</h1>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 sm:p-6 rounded-md mb-6 sm:mb-8 border border-orange-100 dark:border-orange-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormField label="Medical Registration" name="medicalRegistration" placeholder="Medical Registration Number" />
                <FormField label="Clinical Establishment License" name="clinicalLicence" placeholder="State Health Department License" />
                <FormField label="Drug License (if applicable)" name="drugLicence" placeholder="Drug License Number" />
                <FormField label="NABH/UCI Accreditation" name="nabhAccreditation" placeholder="NABH/UCI Accreditation Number" />
                <FormField label="FSSAI License (if applicable)" name="fssaiLicence" placeholder="FSSAI License Number" />
                <FormField label="Biomedical Waste Authorization" name="biomedicalWasteAuth" placeholder="Biomedical Waste Authorization Number" />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-6 sm:mt-8 mb-4">Business Classification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <FormSelect
                label="Industry"
                name="industry"
                options={{
                  placeholder: 'Select Industry',
                  items: ['Healthcare', 'Pharmacy', 'Diagnostic', 'Hospital', 'Clinic', 'Other']
                }}
                required
              />
              <FormSelect
                label="Healthcare Business Type"
                name="healthcareBusinessType"
                options={{
                  placeholder: 'Select Healthcare Business Type',
                  items: ['Hospital', 'Clinic', 'Diagnostic Center', 'Pharmacy', 'Other']
                }}
                required
              />
              <FormSelect
                label="Monthly Marketing Budget"
                name="monthlyMarketingBudget"
                options={{
                  placeholder: 'Select budget range',
                  items: ['₹0-₹50,000', '₹50,000-₹1,00,000', '₹1,00,000-₹5,00,000', '₹5,00,000+']
                }}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 sm:px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3: Website & Technical Access */}
        {step === 3 && (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Website & Technical Access</h1>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-md mb-6 sm:mb-8 border border-blue-100 dark:border-blue-900/40">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Website Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="col-span-1 md:col-span-2">
                  <FormField label="Admin Panel URL" name="adminPanelUrl" placeholder="https://yoursite.com/admin or cPanel URL" required />
                </div>
                <FormField label="Username" name="username" placeholder="Admin username" required />
                <FormField label="Password" name="password" placeholder="Admin password" type="password" required />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 sm:px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 4: SEO & Marketing Services */}
        {step === 4 && (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">SEO & Marketing Services</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Please complete the SEO section if you've purchased SEO services, or skip if not applicable.
              </p>
            </div>

            {/* SEO Information Section */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 sm:p-6 rounded-md mb-6 sm:mb-8 border border-green-100 dark:border-green-900/40">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">SEO Information</h2>
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Previous SEO Report</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    name="previousSeoReport"
                    onChange={handleChange}
                    className="block w-full text-xs sm:text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No file chosen</span>
                </div>
              </div>
              <FormField label="Your Investment in SEO Process" name="investmentInSeoProcess" placeholder="Select your preferred involvement level" isTextarea />
              <FormField label="SEO Remarks" name="seoRemarks" placeholder="Share any remarks related to SEO that you want your SEO executive to be aware of" isTextarea />
            </div>

            {/* Advertising Information Section */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-6 rounded-md mb-6 sm:mb-8 border border-purple-100 dark:border-purple-900/40">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Advertising Information</h2>
              
              <div className="mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Advertising Platforms</label>
                <div className="space-y-2">
                  {['Google Ads', 'Meta Ads (Facebook/Instagram)', 'Both Platforms'].map((platform) => (
                    <div key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        id={platform}
                        name="advertisingPlatforms"
                        value={platform}
                        checked={formData.advertisingPlatforms.includes(platform)}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor={platform} className="ml-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {platform}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <FormSelect
                label="Paid Advertising Investment Comfort Level"
                name="paidAdvertisingInvestmentLevel"
                options={{
                  placeholder: 'Select your comfort level for paid advertising investment',
                  items: ['₹0-₹10,000', '₹10,000-₹50,000', '₹50,000-₹1,00,000', '₹1,00,000+']
                }}
              />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">We'll start conservatively and scale based on performance data and your comfort level</p>

              <FormSelect
                label="Your Investment in Ads Management"
                name="adManagementInvestmentLevel"
                options={{
                  placeholder: 'Select your preferred involvement level',
                  items: ['Minimal', 'Moderate', 'Active']
                }}
              />

              <FormField label="Target Locations for Ads" name="targetLocationsForAds" placeholder="List all locations where you expect customers from" isTextarea />

              <FormField label="Ad Remarks" name="adRemarks" placeholder="Any instructions for your Ad executive" isTextarea />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 sm:px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 5:  */}
          
      </div>
    </div>
  );
};

export default ClientEnrollmentForm;

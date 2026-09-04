const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Hospital = require('./models/Hospital');
const { BloodBank, Scheme } = require('./models/Other');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medisetu';

// ========== HOSPITALS ==========
const hospitals = [
  // --- VADODARA ---
  {
    name: 'SSG Hospital (Sir Sayajirao General Hospital)',
    type: 'government',
    description: 'One of the largest government hospitals in Gujarat, attached to Government Medical College Baroda. Provides free OPD, emergency, and inpatient services across all major specializations.',
    address: {
      street: 'Jail Road (Indira Avenue)',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390001',
      location: { type: 'Point', coordinates: [73.1812, 22.3003] }
    },
    contact: { phone: ['0265-2424848', '0265-2420711'], email: 'ssghospital@gmail.com', website: 'https://medicalcollegebaroda.edu.in' },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: true,
    specializations: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics', 'Oncology', 'Dermatology', 'Ophthalmology', 'ENT', 'Psychiatry', 'General Surgery'],
    facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Radiology', 'Pathology', 'Dialysis', 'Physiotherapy'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 1500,
    icuBeds: 80,
    rating: { average: 3.8, count: 245 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'Jamnabai General Hospital',
    type: 'government',
    description: 'Government hospital in the heart of Vadodara providing free healthcare services including OPD, maternity, and emergency care.',
    address: {
      street: 'Pani Gate Road, Mandvi',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390017',
      location: { type: 'Point', coordinates: [73.1952, 22.3048] }
    },
    contact: { phone: ['0265-2414151'] },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: false,
    specializations: ['General Medicine', 'Gynecology', 'Pediatrics', 'General Surgery'],
    facilities: ['OPD', 'Maternity Ward', 'Emergency Room', 'Pharmacy'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 200,
    icuBeds: 10,
    rating: { average: 3.5, count: 98 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'Gotri Government Hospital',
    type: 'government',
    description: 'Sub-district government hospital on Gotri Road providing primary and secondary healthcare services to the surrounding community.',
    address: {
      street: 'C-503, Gotri Road',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390021',
      location: { type: 'Point', coordinates: [73.1482, 22.3275] }
    },
    contact: { phone: ['0265-2371200'] },
    isOpen24x7: false,
    hasEmergency: true,
    hasAmbulance: false,
    specializations: ['General Medicine', 'Pediatrics', 'Gynecology'],
    facilities: ['OPD', 'Emergency Room', 'Pharmacy', 'Lab'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 100,
    icuBeds: 5,
    rating: { average: 3.2, count: 56 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'Bhailal Amin General Hospital',
    type: 'trust',
    description: 'A well-known charitable trust hospital in Vadodara providing affordable healthcare. Offers subsidized treatment under various government schemes including PMJAY.',
    address: {
      street: 'Gorwa Road, Near IPCL Township',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390003',
      location: { type: 'Point', coordinates: [73.1584, 22.3199] }
    },
    contact: { phone: ['0265-2281500', '0265-2280123'], email: 'info@bagh.org', website: 'https://www.bagh.org' },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: true,
    specializations: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics', 'Oncology', 'Ophthalmology', 'ENT', 'Dental', 'Urology'],
    facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Radiology', 'Pathology', 'Dialysis', 'Physiotherapy', 'Canteen'],
    hasFreeOPD: false,
    hasFreeMedicine: false,
    hasFreeEmergency: false,
    totalBeds: 650,
    icuBeds: 50,
    rating: { average: 4.2, count: 312 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'Baroda Medical College & Hospital',
    type: 'government',
    description: 'Premier government medical college and teaching hospital in Vadodara, providing comprehensive tertiary care with modern facilities.',
    address: {
      street: 'Anandpura, Raopura',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390001',
      location: { type: 'Point', coordinates: [73.1835, 22.2985] }
    },
    contact: { phone: ['0265-2428888'], website: 'https://medicalcollegebaroda.edu.in' },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: true,
    specializations: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics', 'Dermatology', 'Psychiatry', 'Ophthalmology', 'ENT'],
    facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Radiology', 'Pathology', 'Research Labs'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 800,
    icuBeds: 40,
    rating: { average: 3.9, count: 187 },
    status: 'approved',
    isVerified: true,
  },

  // --- AHMEDABAD ---
  {
    name: 'Civil Hospital Ahmedabad (Asarwa)',
    type: 'government',
    description: 'The largest government hospital in Gujarat with 2,500+ beds. Attached to B.J. Medical College, it is a major tertiary care center providing free treatment across all specializations.',
    address: {
      street: 'Asarwa',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380016',
      location: { type: 'Point', coordinates: [72.6070, 23.0465] }
    },
    contact: { phone: ['079-22682000', '079-22683721'], website: 'https://civilhospitalahmedabad.org' },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: true,
    specializations: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics', 'Oncology', 'Dermatology', 'Ophthalmology', 'ENT', 'Dental', 'Psychiatry', 'Nephrology', 'Urology', 'General Surgery', 'Plastic Surgery'],
    facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Radiology', 'MRI', 'CT Scan', 'Pathology', 'Dialysis', 'Physiotherapy', 'Burns Unit', 'Trauma Center'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 2500,
    icuBeds: 150,
    rating: { average: 3.7, count: 523 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'SVP Hospital (Sardar Vallabhbhai Patel Institute of Medical Sciences)',
    type: 'government',
    description: 'A premier multi-specialty government hospital in Ahmedabad providing advanced medical care with modern infrastructure.',
    address: {
      street: 'Ellisbridge',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380006',
      location: { type: 'Point', coordinates: [72.5620, 23.0276] }
    },
    contact: { phone: ['079-26461912', '079-26462121'] },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: true,
    specializations: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics', 'Nephrology', 'Urology', 'General Surgery'],
    facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Radiology', 'Pathology', 'Dialysis'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 700,
    icuBeds: 45,
    rating: { average: 4.0, count: 278 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'L.G. Hospital',
    type: 'government',
    description: 'Government hospital in Maninagar area of Ahmedabad providing affordable healthcare services to the eastern part of the city.',
    address: {
      street: 'Near Rambaug Fire Station, Maninagar',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380008',
      location: { type: 'Point', coordinates: [72.6000, 23.0100] }
    },
    contact: { phone: ['079-25464152', '079-25461212'] },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: true,
    specializations: ['General Medicine', 'Orthopedics', 'Gynecology', 'Pediatrics', 'General Surgery', 'ENT', 'Ophthalmology'],
    facilities: ['ICU', 'Emergency Room', 'Pharmacy', 'Radiology', 'Pathology', 'Maternity Ward'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 450,
    icuBeds: 25,
    rating: { average: 3.6, count: 189 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'ESIC Model Hospital Bapunagar',
    type: 'government',
    description: 'ESIC hospital providing comprehensive healthcare services to insured employees and their families under the ESI scheme.',
    address: {
      street: 'Bapunagar',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380024',
      location: { type: 'Point', coordinates: [72.6350, 23.0400] }
    },
    contact: { phone: ['079-22740050'] },
    isOpen24x7: false,
    hasEmergency: true,
    hasAmbulance: false,
    specializations: ['General Medicine', 'Orthopedics', 'Gynecology', 'Pediatrics', 'Dental', 'Dermatology'],
    facilities: ['OPD', 'Emergency Room', 'Pharmacy', 'Pathology', 'Radiology'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 200,
    icuBeds: 10,
    rating: { average: 3.4, count: 134 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'VS Hospital (Vadilal Sarabhai General Hospital)',
    type: 'trust',
    description: 'One of the oldest charitable trust hospitals in Ahmedabad, established in 1918. Provides affordable multi-specialty healthcare services.',
    address: {
      street: 'Nr. Ellisbridge, Paldi',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380006',
      location: { type: 'Point', coordinates: [72.5605, 23.0210] }
    },
    contact: { phone: ['079-26577621', '079-26574112'], website: 'https://www.vshospital.org' },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: true,
    specializations: ['General Medicine', 'Cardiology', 'Orthopedics', 'Gynecology', 'Pediatrics', 'Ophthalmology', 'ENT', 'General Surgery', 'Dental'],
    facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Radiology', 'Pathology', 'Dialysis', 'Physiotherapy'],
    hasFreeOPD: false,
    hasFreeMedicine: false,
    hasFreeEmergency: false,
    totalBeds: 400,
    icuBeds: 30,
    rating: { average: 4.1, count: 267 },
    status: 'approved',
    isVerified: true,
  },

  // --- GANDHINAGAR ---
  {
    name: 'GMERS Civil Hospital Gandhinagar',
    type: 'government',
    description: 'Major government hospital and medical college in Gandhinagar providing free comprehensive healthcare services. Empaneled under PMJAY and MA Yojana.',
    address: {
      street: 'Civil Hospital Campus, Near Pathikashram, Sector 12',
      city: 'Gandhinagar',
      state: 'Gujarat',
      pincode: '382012',
      location: { type: 'Point', coordinates: [72.6369, 23.2156] }
    },
    contact: { phone: ['079-23240296', '079-23221931'], website: 'https://gmersgandhinagar.com' },
    isOpen24x7: true,
    hasEmergency: true,
    hasAmbulance: true,
    specializations: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Gynecology', 'Pediatrics', 'Oncology', 'Dermatology', 'Ophthalmology', 'ENT', 'Psychiatry', 'General Surgery'],
    facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Radiology', 'MRI', 'CT Scan', 'Pathology', 'Dialysis', 'Physiotherapy'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 600,
    icuBeds: 40,
    rating: { average: 3.9, count: 198 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'Government Hospital Sector 12 Gandhinagar',
    type: 'government',
    description: 'District government hospital in Sector 12, Gandhinagar providing primary and secondary healthcare services to the city population.',
    address: {
      street: '584/2, Sector 2D, Gandhinagar Road',
      city: 'Gandhinagar',
      state: 'Gujarat',
      pincode: '382016',
      location: { type: 'Point', coordinates: [72.6431, 23.2230] }
    },
    contact: { phone: ['079-23221931'] },
    isOpen24x7: false,
    hasEmergency: true,
    hasAmbulance: false,
    specializations: ['General Medicine', 'Gynecology', 'Pediatrics', 'Dental'],
    facilities: ['OPD', 'Emergency Room', 'Pharmacy', 'Pathology'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: true,
    totalBeds: 150,
    icuBeds: 8,
    rating: { average: 3.3, count: 76 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'CHC Sector 21 Gandhinagar',
    type: 'government',
    description: 'Community Health Centre in Sector 21, Gandhinagar. Part of the National Health Mission infrastructure providing primary healthcare and referral services.',
    address: {
      street: 'Sector 21',
      city: 'Gandhinagar',
      state: 'Gujarat',
      pincode: '382021',
      location: { type: 'Point', coordinates: [72.6600, 23.2300] }
    },
    contact: { phone: ['9428047381'] },
    isOpen24x7: false,
    hasEmergency: false,
    hasAmbulance: false,
    specializations: ['General Medicine', 'Gynecology', 'Pediatrics'],
    facilities: ['OPD', 'Pharmacy', 'Immunization Center', 'Maternity Ward'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: false,
    totalBeds: 30,
    icuBeds: 0,
    rating: { average: 3.0, count: 32 },
    status: 'approved',
    isVerified: true,
  },
  {
    name: 'ESIS Dispensary Sector 17 Gandhinagar',
    type: 'government',
    description: 'ESI dispensary in Gandhinagar Sector 17 serving insured workers and their dependents with OPD and basic healthcare services.',
    address: {
      street: 'Sector 17',
      city: 'Gandhinagar',
      state: 'Gujarat',
      pincode: '382017',
      location: { type: 'Point', coordinates: [72.6520, 23.2180] }
    },
    contact: { phone: ['079-23233189', '9737035716'] },
    isOpen24x7: false,
    hasEmergency: false,
    hasAmbulance: false,
    specializations: ['General Medicine', 'Dental'],
    facilities: ['OPD', 'Pharmacy'],
    hasFreeOPD: true,
    hasFreeMedicine: true,
    hasFreeEmergency: false,
    totalBeds: 0,
    icuBeds: 0,
    rating: { average: 3.1, count: 45 },
    status: 'approved',
    isVerified: true,
  },
];

// ========== GOVERNMENT SCHEMES ==========
const schemes = [
  // --- CENTRAL GOVERNMENT ---
  {
    name: 'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana',
    shortName: 'AB-PMJAY',
    launchedBy: 'central',
    description: 'World\'s largest government-funded health insurance scheme providing free health cover of ₹5 lakh per family per year for secondary and tertiary hospitalization. Covers 1,949+ medical procedures across 27 specialties. Cashless and paperless treatment at empaneled hospitals. Now extended to all senior citizens aged 70+.',
    benefits: [
      'Free health cover up to ₹5 lakh per family per year',
      'Cashless and paperless treatment at empaneled hospitals',
      'Covers 1,949+ medical procedures across 27 specialties',
      'Pre-existing diseases covered from day one',
      'No restriction on family size, age, or gender',
      'Covers pre and post-hospitalization expenses',
      'Free medicines, diagnostics, and transport allowance',
      'Extended to all citizens aged 70+ irrespective of income'
    ],
    eligibility: [
      'BPL families identified via SECC 2011',
      'Deprived rural households',
      'Urban workers in specific occupations',
      'All citizens aged 70 years and above',
      'ASHA, Anganwadi Workers and Helpers'
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'SECC Data', 'Mobile Number'],
    coverageAmount: 500000,
    website: 'https://pmjay.gov.in',
    helplineNumber: '14555',
    icon: '🏥',
    isActive: true,
  },
  {
    name: 'Central Government Health Scheme',
    shortName: 'CGHS',
    launchedBy: 'central',
    description: 'Comprehensive healthcare scheme for central government employees, pensioners, and their dependents. Provides treatment at CGHS dispensaries and empaneled government and private hospitals with cashless facilities.',
    benefits: [
      'OPD treatment at CGHS wellness centers',
      'Indoor treatment at empaneled hospitals',
      'Cashless facility at empaneled hospitals',
      'Covers nearly 2,000 medical procedures',
      'Reimbursement for emergency treatment',
      'Covers medicines and diagnostics'
    ],
    eligibility: [
      'Central government employees',
      'Central government pensioners',
      'Members of Parliament',
      'Judges of Supreme Court and High Courts',
      'Dependents of above categories'
    ],
    requiredDocuments: ['CGHS Card', 'Government ID', 'Aadhaar Card'],
    website: 'https://cghs.gov.in',
    helplineNumber: '1800-11-1363',
    icon: '🏛️',
    isActive: true,
  },
  {
    name: 'Janani Suraksha Yojana',
    shortName: 'JSY',
    launchedBy: 'central',
    description: 'Safe motherhood intervention under the National Health Mission promoting institutional delivery. Provides cash assistance to pregnant women from BPL families for hospital delivery, especially in states with low institutional delivery rates.',
    benefits: [
      'Cash assistance of ₹1,400 (rural) and ₹1,000 (urban) for delivery',
      'Free institutional delivery at government hospitals',
      'Free transport from home to hospital',
      'Free post-delivery care and follow-up',
      'ASHA worker assistance during pregnancy and delivery'
    ],
    eligibility: [
      'Pregnant women from BPL families',
      'All pregnant women delivering in government hospitals in low-performing states',
      'Women aged 19 years and above',
      'Up to two live births'
    ],
    requiredDocuments: ['BPL Card', 'Aadhaar Card', 'MCP Card (Mother and Child Card)', 'Bank Account Details'],
    website: 'https://nhm.gov.in',
    helplineNumber: '104',
    icon: '🤰',
    isActive: true,
  },
  {
    name: 'Rashtriya Bal Swasthya Karyakram',
    shortName: 'RBSK',
    launchedBy: 'central',
    description: 'Child health screening and early intervention program covering children from birth to 18 years. Screens for 4Ds: Defects at birth, Deficiencies, Diseases, and Developmental delays including disability. Provides free treatment including surgery.',
    benefits: [
      'Free health screening for children 0–18 years',
      'Early detection of birth defects and diseases',
      'Free corrective surgeries for birth defects',
      'Free treatment for childhood diseases',
      'Nutritional and growth monitoring',
      'Referral and follow-up services'
    ],
    eligibility: [
      'All children from birth to 18 years',
      'Enrolled in government and government-aided schools',
      'Newborns at public health facilities'
    ],
    requiredDocuments: ['Birth Certificate', 'School ID (if applicable)', 'Aadhaar Card of Parent'],
    coverageAmount: 0,
    website: 'https://nhm.gov.in',
    helplineNumber: '104',
    icon: '👶',
    isActive: true,
  },
  {
    name: 'Pradhan Mantri Surakshit Matritva Abhiyan',
    shortName: 'PMSMA',
    launchedBy: 'central',
    description: 'Provides free comprehensive and quality antenatal care to all pregnant women on the 9th of every month. Focuses on identifying high-risk pregnancies for timely referrals and interventions.',
    benefits: [
      'Free comprehensive antenatal checkup on 9th of every month',
      'Free ultrasound and blood tests',
      'Identification and management of high-risk pregnancies',
      'Free iron and folic acid supplements',
      'Counseling on nutrition and institutional delivery'
    ],
    eligibility: [
      'All pregnant women (especially in 2nd/3rd trimester)',
      'Pregnant women attending government health facilities'
    ],
    requiredDocuments: ['MCP Card', 'Aadhaar Card', 'Any ID Proof'],
    website: 'https://pmsma.nhp.gov.in',
    helplineNumber: '104',
    icon: '🤱',
    isActive: true,
  },
  {
    name: 'National Health Mission',
    shortName: 'NHM',
    launchedBy: 'central',
    description: 'Umbrella program encompassing the National Rural Health Mission (NRHM) and National Urban Health Mission (NUHM). Aims to provide universal access to equitable, affordable, and quality healthcare, especially for vulnerable populations.',
    benefits: [
      'Free treatment at public health facilities',
      'Free drugs and diagnostics at government hospitals',
      'Free ambulance services (108/102)',
      'Mobile medical units in rural areas',
      'Free immunization programs',
      'Financial support for health infrastructure'
    ],
    eligibility: [
      'All citizens, especially rural and urban poor',
      'Pregnant women and children',
      'SC/ST and other vulnerable populations'
    ],
    requiredDocuments: ['Any ID Proof', 'Aadhaar Card'],
    website: 'https://nhm.gov.in',
    helplineNumber: '104',
    icon: '🏗️',
    isActive: true,
  },
  {
    name: 'Employees\' State Insurance Scheme',
    shortName: 'ESIS',
    launchedBy: 'central',
    description: 'Self-financing social security and health insurance scheme for salaried employees earning ₹21,000/month or less, working in establishments with 10+ employees. Provides comprehensive healthcare for employees and dependents.',
    benefits: [
      'Full medical care for employee and family',
      'Hospitalization and surgery coverage',
      'Maternity benefit for 26 weeks',
      'Disability benefit',
      'Dependants\' benefit in case of death',
      'Funeral expenses up to ₹15,000'
    ],
    eligibility: [
      'Employees earning up to ₹21,000/month',
      'Establishments with 10+ employees',
      'Dependents of insured persons'
    ],
    requiredDocuments: ['ESI Card', 'Insurance Number', 'Employer Certificate', 'Aadhaar Card'],
    website: 'https://esic.gov.in',
    helplineNumber: '1800-11-2526',
    icon: '🏭',
    isActive: true,
  },
  {
    name: 'Pradhan Mantri Swasthya Suraksha Yojana',
    shortName: 'PMSSY',
    launchedBy: 'central',
    description: 'Aims to correct regional imbalances in availability of affordable and reliable tertiary healthcare by establishing new AIIMS-like institutions and upgrading existing government medical colleges across India.',
    benefits: [
      'New AIIMS-like institutions across India',
      'Upgradation of government medical colleges',
      'Super specialty blocks and trauma centers',
      'Advanced diagnostic labs and equipment',
      'Affordable tertiary healthcare in underserved areas'
    ],
    eligibility: [
      'All citizens accessing government medical colleges and AIIMS',
      'Patients referred for tertiary care'
    ],
    requiredDocuments: ['Any ID Proof', 'Referral Letter (if applicable)'],
    website: 'https://pmssy-mohfw.nic.in',
    helplineNumber: '1800-180-1104',
    icon: '🏗️',
    isActive: true,
  },
  {
    name: 'Pradhan Mantri Matru Vandana Yojana',
    shortName: 'PMMVY',
    launchedBy: 'central',
    description: 'Maternity benefit program providing direct cash transfer of ₹5,000 (1st child) and ₹6,000 (2nd child, if girl) to pregnant and lactating women for their first living child to improve health and nutrition.',
    benefits: [
      'Cash benefit of ₹5,000 for first child in 3 installments',
      '₹6,000 for second child if girl',
      'Compensation for wage loss during pregnancy',
      'Promotion of safe delivery practices',
      'Encourages health and nutrition-seeking behavior'
    ],
    eligibility: [
      'Pregnant and lactating women for first living child',
      'Women aged 19 years and above',
      'Not applicable for government employees or those under similar benefits'
    ],
    requiredDocuments: ['MCP Card', 'Aadhaar Card', 'Bank Account Details', 'Pregnancy Registration Proof'],
    website: 'https://wcd.nic.in',
    helplineNumber: '181',
    icon: '👩‍👧',
    isActive: true,
  },
  {
    name: 'Niramaya Health Insurance Scheme',
    shortName: 'Niramaya',
    launchedBy: 'central',
    description: 'Affordable health insurance scheme for persons with disabilities (PwDs). Provides health cover of ₹1 lakh for OPD treatment, hospitalization, surgeries, therapies, and pathology at nominal premium.',
    benefits: [
      'Health cover up to ₹1 lakh per year',
      'Covers OPD treatment, hospitalization, and surgery',
      'Covers therapies (physiotherapy, occupational, speech)',
      'Affordable premium: ₹250–₹500/year',
      'Covers alternative medicines (Ayurveda, Homeopathy)',
      'Transportation costs for treatment included'
    ],
    eligibility: [
      'Persons with Autism, Cerebral Palsy, Mental Retardation, Multiple Disabilities',
      'Registered with Local Level Committee under National Trust',
      'Any age group'
    ],
    requiredDocuments: ['Disability Certificate', 'National Trust Registration', 'Aadhaar Card', 'Bank Account Details'],
    coverageAmount: 100000,
    website: 'https://thenationaltrust.gov.in',
    helplineNumber: '1800-11-4461',
    icon: '♿',
    isActive: true,
  },

  // --- GUJARAT STATE ---
  {
    name: 'Mukhyamantri Amrutam Yojana',
    shortName: 'MA Yojana',
    launchedBy: 'state',
    state: 'Gujarat',
    description: 'Gujarat government\'s flagship health insurance scheme integrated with PMJAY. Provides cashless health coverage of up to ₹5 lakh per family per year for critical illnesses and surgeries at empaneled hospitals. Covers 2,400+ medical packages.',
    benefits: [
      'Cashless health coverage up to ₹5 lakh per family per year',
      'Covers 2,400+ medical treatment packages',
      'Covers cardiac, cancer, kidney, neonatal, and burn treatments',
      'Pre and post-hospitalization expenses covered',
      'Free diagnostics, medicines, and consultation',
      'Transportation allowance of ₹300 per visit',
      'No premium or registration fee',
      'Integrated with PMJAY for nationwide coverage'
    ],
    eligibility: [
      'Families with annual income up to ₹4 lakh',
      'BPL families of Gujarat',
      'Registered with MA Yojana portal'
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card / Income Certificate', 'BPL Card (if applicable)', 'Bank Account Details', 'Family Photo'],
    coverageAmount: 500000,
    website: 'https://magujarat.com',
    helplineNumber: '1800-233-1022',
    icon: '🌿',
    isActive: true,
  },
  {
    name: 'Mukhyamantri Amrutam Vatsalya Yojana',
    shortName: 'MA Vatsalya',
    launchedBy: 'state',
    state: 'Gujarat',
    description: 'Extension of the MA Yojana specifically for senior citizens in Gujarat. Provides cashless health coverage for families with annual income up to ₹6 lakh, focusing on elderly healthcare needs.',
    benefits: [
      'Cashless health coverage up to ₹5 lakh',
      'Designed for senior citizens\' healthcare needs',
      'Covers critical illnesses: cardiac, cancer, kidney, neurological',
      'Free diagnostics and medicines',
      'Pre and post-hospitalization expenses included',
      'Transportation allowance',
      'No premium or registration fee'
    ],
    eligibility: [
      'Senior citizens from families with annual income up to ₹6 lakh',
      'Resident of Gujarat state',
      'Must have MA Vatsalya card'
    ],
    requiredDocuments: ['Aadhaar Card', 'Age Proof', 'Income Certificate', 'Ration Card', 'Bank Account Details'],
    coverageAmount: 500000,
    website: 'https://magujarat.com',
    helplineNumber: '1800-233-1022',
    icon: '👴',
    isActive: true,
  },
];

// ========== BLOOD BANKS (VADODARA) ==========
const bloodBanks = [
  {
    name: 'SSG Hospital Blood Bank',
    address: {
      city: 'Vadodara', state: 'Gujarat', pincode: '390001',
      location: { type: 'Point', coordinates: [73.1812, 22.3003] }
    },
    contact: { phone: ['0265-2424848'], email: 'ssghbb@gmail.com' },
    availability: [
      { bloodGroup: 'A+', units: 25 }, { bloodGroup: 'A-', units: 8 },
      { bloodGroup: 'B+', units: 30 }, { bloodGroup: 'B-', units: 5 },
      { bloodGroup: 'AB+', units: 12 }, { bloodGroup: 'AB-', units: 3 },
      { bloodGroup: 'O+', units: 35 }, { bloodGroup: 'O-', units: 10 },
    ],
    isOpen24x7: true,
    isFree: true,
    isActive: true,
  },
  {
    name: 'Dhwani Blood Bank',
    address: {
      city: 'Vadodara', state: 'Gujarat', pincode: '390007',
      location: { type: 'Point', coordinates: [73.1896, 22.2995] }
    },
    contact: { phone: ['7069110606', '7069110505'], email: 'dbc210121@gmail.com' },
    availability: [
      { bloodGroup: 'A+', units: 18 }, { bloodGroup: 'A-', units: 5 },
      { bloodGroup: 'B+', units: 22 }, { bloodGroup: 'B-', units: 4 },
      { bloodGroup: 'AB+', units: 8 }, { bloodGroup: 'AB-', units: 2 },
      { bloodGroup: 'O+', units: 28 }, { bloodGroup: 'O-', units: 7 },
    ],
    isOpen24x7: true,
    isFree: false,
    isActive: true,
  },
  {
    name: 'Indu Voluntary Blood Bank',
    address: {
      city: 'Vadodara', state: 'Gujarat', pincode: '390001',
      location: { type: 'Point', coordinates: [73.1925, 22.3060] }
    },
    contact: { phone: ['0265-2437676', '9825017334'], email: 'ibb.vadodara@gmail.com' },
    availability: [
      { bloodGroup: 'A+', units: 15 }, { bloodGroup: 'A-', units: 6 },
      { bloodGroup: 'B+', units: 20 }, { bloodGroup: 'B-', units: 3 },
      { bloodGroup: 'AB+', units: 10 }, { bloodGroup: 'AB-', units: 2 },
      { bloodGroup: 'O+', units: 25 }, { bloodGroup: 'O-', units: 8 },
    ],
    isOpen24x7: true,
    isFree: false,
    isActive: true,
  },
  {
    name: 'Shri Jalaram Blood Bank (Medical Care Centre Trust)',
    address: {
      city: 'Vadodara', state: 'Gujarat', pincode: '390018',
      location: { type: 'Point', coordinates: [73.2050, 22.3101] }
    },
    contact: { phone: ['0265-2464130', '9825335065'], email: 'kgpchospital1984@yahoo.com' },
    availability: [
      { bloodGroup: 'A+', units: 12 }, { bloodGroup: 'A-', units: 4 },
      { bloodGroup: 'B+', units: 16 }, { bloodGroup: 'B-', units: 3 },
      { bloodGroup: 'AB+', units: 6 }, { bloodGroup: 'AB-', units: 1 },
      { bloodGroup: 'O+', units: 20 }, { bloodGroup: 'O-', units: 5 },
    ],
    isOpen24x7: false,
    hours: '9:00 AM – 6:00 PM',
    isFree: false,
    isActive: true,
  },
  {
    name: 'Dhiraj General Blood Bank',
    address: {
      city: 'Vadodara', state: 'Gujarat', pincode: '391760',
      location: { type: 'Point', coordinates: [73.1340, 22.2860] }
    },
    contact: { phone: ['02668-225264', '9601151034'], email: 'dghmainoffice@yahoo.com' },
    availability: [
      { bloodGroup: 'A+', units: 10 }, { bloodGroup: 'A-', units: 3 },
      { bloodGroup: 'B+', units: 14 }, { bloodGroup: 'B-', units: 2 },
      { bloodGroup: 'AB+', units: 5 }, { bloodGroup: 'AB-', units: 1 },
      { bloodGroup: 'O+', units: 18 }, { bloodGroup: 'O-', units: 4 },
    ],
    isOpen24x7: false,
    hours: '8:30 AM – 5:30 PM',
    isFree: false,
    isActive: true,
  },
  {
    name: 'Bhailal Amin General Hospital Blood Bank',
    address: {
      city: 'Vadodara', state: 'Gujarat', pincode: '390003',
      location: { type: 'Point', coordinates: [73.1584, 22.3199] }
    },
    contact: { phone: ['0265-2281500'], email: 'bloodbank@bagh.org' },
    availability: [
      { bloodGroup: 'A+', units: 20 }, { bloodGroup: 'A-', units: 7 },
      { bloodGroup: 'B+', units: 25 }, { bloodGroup: 'B-', units: 5 },
      { bloodGroup: 'AB+', units: 9 }, { bloodGroup: 'AB-', units: 3 },
      { bloodGroup: 'O+', units: 30 }, { bloodGroup: 'O-', units: 9 },
    ],
    isOpen24x7: true,
    isFree: false,
    isActive: true,
  },
  {
    name: 'Indian Red Cross Society Blood Bank Vadodara',
    address: {
      city: 'Vadodara', state: 'Gujarat', pincode: '390001',
      location: { type: 'Point', coordinates: [73.1860, 22.3045] }
    },
    contact: { phone: ['0265-2426285'] },
    availability: [
      { bloodGroup: 'A+', units: 22 }, { bloodGroup: 'A-', units: 9 },
      { bloodGroup: 'B+', units: 28 }, { bloodGroup: 'B-', units: 6 },
      { bloodGroup: 'AB+', units: 11 }, { bloodGroup: 'AB-', units: 4 },
      { bloodGroup: 'O+', units: 32 }, { bloodGroup: 'O-', units: 11 },
    ],
    isOpen24x7: true,
    isFree: true,
    isActive: true,
  },
  {
    name: 'Ayush Blood Bank',
    address: {
      city: 'Vadodara', state: 'Gujarat', pincode: '390007',
      location: { type: 'Point', coordinates: [73.1780, 22.3100] }
    },
    contact: { phone: ['0265-2350505'] },
    availability: [
      { bloodGroup: 'A+', units: 8 }, { bloodGroup: 'A-', units: 2 },
      { bloodGroup: 'B+', units: 12 }, { bloodGroup: 'B-', units: 2 },
      { bloodGroup: 'AB+', units: 4 }, { bloodGroup: 'AB-', units: 1 },
      { bloodGroup: 'O+', units: 15 }, { bloodGroup: 'O-', units: 3 },
    ],
    isOpen24x7: false,
    hours: '9:00 AM – 7:00 PM',
    isFree: false,
    isActive: true,
  },
];

// ========== SEED FUNCTION ==========
async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB\n');

    // Seed Hospitals
    console.log('🏥 Seeding hospitals...');
    await Hospital.deleteMany({ status: 'approved', 'address.state': 'Gujarat' });
    const insertedHospitals = await Hospital.insertMany(hospitals);
    console.log(`   ✅ Inserted ${insertedHospitals.length} hospitals\n`);

    // Seed Schemes
    console.log('🏛️ Seeding government schemes...');
    await Scheme.deleteMany({});
    const insertedSchemes = await Scheme.insertMany(schemes);
    console.log(`   ✅ Inserted ${insertedSchemes.length} schemes\n`);

    // Seed Blood Banks
    console.log('🩸 Seeding blood banks...');
    await BloodBank.deleteMany({ 'address.city': 'Vadodara' });
    const insertedBanks = await BloodBank.insertMany(bloodBanks);
    console.log(`   ✅ Inserted ${insertedBanks.length} blood banks\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`   Total: ${insertedHospitals.length} hospitals, ${insertedSchemes.length} schemes, ${insertedBanks.length} blood banks`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();

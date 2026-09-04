const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { Scheme, BloodBank } = require('../models/Other');

const connectDB = require('./db');

const seedData = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  await Hospital.deleteMany({});
  await Doctor.deleteMany({});
  await Scheme.deleteMany({});
  await BloodBank.deleteMany({});

  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@medisetu.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin User', email: 'admin@medisetu.com',
      phone: '9999999999', password: 'Admin@123', role: 'admin', isVerified: true
    });
    console.log('✅ Admin created: admin@medisetu.com / Admin@123');
  }

  // Schemes
  const schemes = await Scheme.insertMany([
    {
      name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
      shortName: 'PMJAY / AB', launchedBy: 'central',
      description: 'Health coverage of ₹5 lakh per family per year for secondary and tertiary care.',
      benefits: ['₹5 lakh health coverage', 'Cashless treatment', '1,500+ medical packages', 'No premium for beneficiary'],
      eligibility: ['BPL families', 'SECC 2011 database families', 'Construction workers', 'Migrant workers'],
      requiredDocuments: ['Aadhaar Card', 'Ration Card', 'PMJAY e-card'],
      coverageAmount: 500000, website: 'https://pmjay.gov.in', helplineNumber: '14555', isActive: true
    },
    {
      name: 'MA Vatsalya Yojana', shortName: 'MA Vatsalya', launchedBy: 'state', state: 'Gujarat',
      description: 'Gujarat state scheme providing free healthcare and medicines at government hospitals.',
      benefits: ['Free OPD services', 'Free medicines', 'Free diagnostics', 'Free emergency care'],
      eligibility: ['Gujarat residents', 'BPL card holders', 'Antyodaya card holders'],
      requiredDocuments: ['Aadhaar Card', 'BPL/Antyodaya Card', 'Residence proof'],
      website: 'https://health.gujarat.gov.in', helplineNumber: '104', isActive: true
    },
    {
      name: 'Janani Suraksha Yojana', shortName: 'JSY', launchedBy: 'central',
      description: 'Safe motherhood intervention promoting institutional delivery among pregnant women.',
      benefits: ['Cash incentive for institutional delivery', 'Free delivery care', 'Post-natal support'],
      eligibility: ['Pregnant women', 'BPL families preferred', 'SC/ST women'],
      requiredDocuments: ['Aadhaar Card', 'BPL Card', 'MCH card'],
      helplineNumber: '102', isActive: true
    },
    {
      name: 'Pradhan Mantri Jan Aushadhi Pariyojana', shortName: 'PMJAP', launchedBy: 'central',
      description: 'Providing quality generic medicines at affordable prices through dedicated stores.',
      benefits: ['50-90% cheaper generic medicines', '8000+ stores', '900+ essential medicines', '300+ surgical items'],
      eligibility: ['All citizens', 'No income criteria'],
      requiredDocuments: ['Prescription from doctor'],
      website: 'https://janaushadhi.gov.in', helplineNumber: '1800-180-8080', isActive: true
    }
  ]);

  // Hospitals
  const hospitalAdminUser = await User.findOne({ email: 'admin@medisetu.com' });

  const hospitals = await Hospital.insertMany([
    {
      name: 'New Civil Hospital, Surat',
      registrationNumber: 'GJ-HOSP-001',
      type: 'government',
      description: 'One of the largest government hospitals in South Gujarat providing free and subsidized healthcare to all.',
      images: [],
      address: {
        street: 'Ring Road, Majura Gate',
        city: 'Surat', state: 'Gujarat', pincode: '395001',
        location: { type: 'Point', coordinates: [72.8311, 21.1702] }
      },
      contact: { phone: ['0261-2244000', '0261-2244001'], email: 'civilhosp@gujarat.gov.in', website: 'https://civilhospitalsurat.com' },
      isOpen24x7: true, hasEmergency: true, hasAmbulance: true,
      specializations: ['General Medicine', 'Surgery', 'Orthopedics', 'Gynecology', 'Pediatrics', 'Cardiology', 'Neurology', 'Oncology', 'Urology', 'ENT'],
      treatmentTypes: ['OPD', 'IPD', 'Emergency', 'ICU', 'NICU', 'Burns', 'Trauma'],
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'X-Ray', 'MRI', 'CT Scan', 'Lab'],
      treatments: [
        { name: 'OPD Consultation', isFree: true, cost: { min: 0, max: 0 } },
        { name: 'Emergency Treatment', isFree: true, cost: { min: 0, max: 0 } },
        { name: 'General Surgery', isFree: false, cost: { min: 500, max: 5000 } },
      ],
      governmentSchemes: [schemes[0]._id, schemes[1]._id],
      hasFreeOPD: true, hasFreeMedicine: true, hasFreeEmergency: true,
      totalBeds: 1800, icuBeds: 80,
      rating: { average: 4.2, count: 2340 },
      status: 'approved', isVerified: true, isFeatured: true,
      registeredBy: hospitalAdminUser._id
    },
    {
      name: 'SMIMER Medical College & Hospital',
      registrationNumber: 'GJ-HOSP-002',
      type: 'government',
      description: 'Surat Municipal Institute of Medical Education and Research – tertiary care teaching hospital.',
      address: {
        street: 'Mor Bangla, Umarwada',
        city: 'Surat', state: 'Gujarat', pincode: '395010',
        location: { type: 'Point', coordinates: [72.8553, 21.2100] }
      },
      contact: { phone: ['0261-2475100'], email: 'smimer@smcgov.org' },
      isOpen24x7: true, hasEmergency: true, hasAmbulance: true,
      specializations: ['Cardiology', 'Nephrology', 'Gastroenterology', 'Neurosurgery', 'Plastic Surgery', 'General Medicine', 'Pediatrics'],
      treatmentTypes: ['OPD', 'IPD', 'Emergency', 'ICU', 'Dialysis'],
      facilities: ['ICU', 'Blood Bank', 'Dialysis', 'Cath Lab', 'MRI', 'CT Scan', 'Pharmacy'],
      hasFreeOPD: true, hasFreeMedicine: true, hasFreeEmergency: true,
      totalBeds: 700, icuBeds: 50,
      governmentSchemes: [schemes[0]._id, schemes[1]._id],
      rating: { average: 4.4, count: 1820 },
      status: 'approved', isVerified: true,
      registeredBy: hospitalAdminUser._id
    },
    {
      name: 'Kiran Multi-Speciality Hospital',
      registrationNumber: 'GJ-HOSP-003',
      type: 'private',
      description: 'Premium private multi-speciality hospital with state-of-the-art equipment and expert doctors.',
      address: {
        street: 'Vesu Main Road',
        city: 'Surat', state: 'Gujarat', pincode: '395007',
        location: { type: 'Point', coordinates: [72.7958, 21.1427] }
      },
      contact: { phone: ['0261-3333000'], email: 'info@kiranhospital.com', website: 'https://kiranhospital.com' },
      isOpen24x7: true, hasEmergency: true, hasAmbulance: true,
      specializations: ['Oncology', 'Cardiology', 'IVF', 'Orthopedics', 'Robotic Surgery', 'Neurology'],
      treatments: [
        { name: 'OPD Consultation', isFree: false, cost: { min: 500, max: 1500 } },
        { name: 'Cardiac Surgery', isFree: false, cost: { min: 150000, max: 500000 } },
      ],
      hasFreeOPD: false, hasFreeMedicine: false, hasFreeEmergency: false,
      totalBeds: 300, icuBeds: 40,
      rating: { average: 4.8, count: 960 },
      status: 'approved', isVerified: true,
      registeredBy: hospitalAdminUser._id
    },
    {
      name: 'Government Ayurvedic Hospital',
      registrationNumber: 'GJ-HOSP-004',
      type: 'ayurvedic',
      description: 'Government-run Ayurvedic hospital providing free traditional treatment.',
      address: {
        street: 'Nanpura, Near Court',
        city: 'Surat', state: 'Gujarat', pincode: '395001',
        location: { type: 'Point', coordinates: [72.8399, 21.1960] }
      },
      contact: { phone: ['0261-2460500'] },
      isOpen24x7: false,
      hours: { monday: { open: '09:00', close: '17:00' }, tuesday: { open: '09:00', close: '17:00' } },
      specializations: ['Ayurveda', 'Panchakarma', 'Naturopathy', 'Yoga Therapy'],
      hasFreeOPD: true, hasFreeMedicine: true, hasFreeEmergency: false,
      governmentSchemes: [schemes[1]._id],
      totalBeds: 50,
      rating: { average: 4.2, count: 540 },
      status: 'approved', isVerified: true,
      registeredBy: hospitalAdminUser._id
    }
  ]);

  // Doctors
  await Doctor.insertMany([
    {
      hospital: hospitals[0]._id,
      name: 'Dr. Priya Sharma', specialization: 'General Medicine',
      qualifications: ['MBBS', 'MD - General Medicine'],
      experience: 12, languages: ['English', 'Hindi', 'Gujarati'],
      consultationFee: 0, isFreeConsultation: true,
      availability: [
        { day: 'Monday', slots: [{ startTime: '09:00', endTime: '13:00', maxPatients: 30 }] },
        { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '13:00', maxPatients: 30 }] },
        { day: 'Friday', slots: [{ startTime: '09:00', endTime: '13:00', maxPatients: 30 }] },
      ],
      rating: { average: 4.7, count: 320 }
    },
    {
      hospital: hospitals[0]._id,
      name: 'Dr. Raj Patel', specialization: 'Cardiology',
      qualifications: ['MBBS', 'MD - Cardiology', 'DM Cardiology'],
      experience: 18, languages: ['English', 'Gujarati'],
      consultationFee: 0, isFreeConsultation: true,
      availability: [
        { day: 'Tuesday', slots: [{ startTime: '10:00', endTime: '14:00', maxPatients: 20 }] },
        { day: 'Thursday', slots: [{ startTime: '10:00', endTime: '14:00', maxPatients: 20 }] },
      ],
      rating: { average: 4.9, count: 450 }
    },
    {
      hospital: hospitals[0]._id,
      name: 'Dr. Meera Joshi', specialization: 'Gynecology',
      qualifications: ['MBBS', 'MS - Obstetrics & Gynecology'],
      experience: 15, languages: ['English', 'Hindi', 'Gujarati'],
      consultationFee: 0, isFreeConsultation: true,
      availability: [
        { day: 'Monday', slots: [{ startTime: '14:00', endTime: '18:00', maxPatients: 25 }] },
        { day: 'Thursday', slots: [{ startTime: '14:00', endTime: '18:00', maxPatients: 25 }] },
      ],
      rating: { average: 4.8, count: 280 }
    },
    {
      hospital: hospitals[1]._id,
      name: 'Dr. Arjun Mehta', specialization: 'Cardiology',
      qualifications: ['MBBS', 'DM Cardiology', 'FACC'],
      experience: 22, languages: ['English', 'Gujarati'],
      consultationFee: 0, isFreeConsultation: true,
      availability: [
        { day: 'Monday', slots: [{ startTime: '09:00', endTime: '12:00', maxPatients: 15 }] },
        { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '12:00', maxPatients: 15 }] },
      ],
      rating: { average: 4.9, count: 620 }
    },
    {
      hospital: hospitals[2]._id,
      name: 'Dr. Sunita Kapoor', specialization: 'Oncology',
      qualifications: ['MBBS', 'MD - Oncology', 'FRCP'],
      experience: 20, languages: ['English', 'Hindi'],
      consultationFee: 1000, isFreeConsultation: false,
      availability: [
        { day: 'Monday', slots: [{ startTime: '10:00', endTime: '16:00', maxPatients: 12 }] },
        { day: 'Thursday', slots: [{ startTime: '10:00', endTime: '16:00', maxPatients: 12 }] },
      ],
      rating: { average: 4.9, count: 180 }
    }
  ]);

  // Blood Banks
  await BloodBank.insertMany([
    {
      name: 'Civil Hospital Blood Bank',
      hospital: hospitals[0]._id,
      address: { city: 'Surat', state: 'Gujarat', pincode: '395001',
        location: { type: 'Point', coordinates: [72.8311, 21.1702] } },
      contact: { phone: ['0261-2244100'], email: 'bloodbank@civilhosp.com' },
      availability: [
        { bloodGroup: 'A+', units: 25 }, { bloodGroup: 'A-', units: 8 },
        { bloodGroup: 'B+', units: 30 }, { bloodGroup: 'B-', units: 5 },
        { bloodGroup: 'AB+', units: 12 }, { bloodGroup: 'AB-', units: 3 },
        { bloodGroup: 'O+', units: 40 }, { bloodGroup: 'O-', units: 10 },
      ],
      isOpen24x7: true, isFree: true, isActive: true
    },
    {
      name: 'Red Cross Blood Bank Surat',
      address: { city: 'Surat', state: 'Gujarat', pincode: '395003',
        location: { type: 'Point', coordinates: [72.8396, 21.1924] } },
      contact: { phone: ['0261-2460100'] },
      availability: [
        { bloodGroup: 'A+', units: 15 }, { bloodGroup: 'B+', units: 18 },
        { bloodGroup: 'O+', units: 22 }, { bloodGroup: 'AB+', units: 7 },
      ],
      isOpen24x7: false, hours: '8am - 8pm', isFree: false, isActive: true
    }
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`   📊 ${hospitals.length} hospitals`);
  console.log(`   🩺 5 doctors`);
  console.log(`   📋 ${schemes.length} government schemes`);
  console.log(`   🩸 2 blood banks`);
  console.log('\n🔑 Admin Login: admin@medisetu.com / Admin@123');
  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });

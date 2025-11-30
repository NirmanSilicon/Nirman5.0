#!/usr/bin/env node

const BASE_URL = 'http://localhost:3000';

// Ayurvedic Lifestyle clinic data
const clinicData = {
  registration: {
    email: 'ayurvedic.lifestyle2@clinic.com',
    password: 'clinic123',
    phoneNumber: '+91-9876543210'
  },
  profile: {
    clinicName: 'Ayurvedic Lifestyle',
    ownerName: 'Dr. Rajesh Kumar Sharma',
    phoneNumber: '+91-9876543210',
    email: 'ayurvedic.lifestyle2@clinic.com',
    address: 'Plot No.: N5-28, 1st Floor ID Market Road, opposite Govt. High School, beside Radhika, IRC Village, Nayapalli, Bhubaneswar, Odisha 751015',
    nearbyCity: 'Bhubaneswar',
    distance: '~25 min by car',
    googleMapsLocation: 'https://maps.google.com/?q=IRC+Village+Nayapalli+Bhubaneswar',
    services: [
      'Panchakarma Therapy',
      'Abhyanga Massage', 
      'Shirodhara',
      'Basti Treatment',
      'Virechana',
      'Nasya Therapy',
      'Udvartana',
      'Pizhichil',
      'Kizhi Treatment',
      'Marma Therapy'
    ],
    doctors: [
      {
        name: 'Dr. Rajesh Kumar Sharma',
        specialization: 'Panchakarma Specialist',
        experience: '15 years'
      },
      {
        name: 'Dr. Priya Singh', 
        specialization: 'Women\'s Health & Fertility',
        experience: '12 years'
      },
      {
        name: 'Dr. Amit Kumar',
        specialization: 'Skin & Hair Care', 
        experience: '10 years'
      }
    ],
    photos: [
      'clinic-exterior.jpg',
      'reception-area.jpg',
      'treatment-room-1.jpg',
      'treatment-room-2.jpg',
      'panchakarma-hall.jpg',
      'waiting-area.jpg'
    ]
  }
};

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function createClinic() {
  console.log('🏥 Creating Ayurvedic Lifestyle Clinic...');
  console.log('=' .repeat(50));

  // Step 1: Register clinic
  console.log('📝 Step 1: Registering clinic...');
  const registrationResult = await makeRequest(`${BASE_URL}/api/clinic/register`, {
    method: 'POST',
    body: JSON.stringify(clinicData.registration)
  });

  if (!registrationResult.success) {
    console.log('❌ Registration failed:', registrationResult.error);
    return;
  }

  const clinicId = registrationResult.data.clinic.clinic_id;
  console.log('✅ Clinic registered! ID:', clinicId);

  // Step 2: Update profile
  console.log('📝 Step 2: Updating clinic profile...');
  const profileResult = await makeRequest(`${BASE_URL}/api/clinic/update`, {
    method: 'POST',
    body: JSON.stringify({
      clinicId: clinicId,
      ...clinicData.profile
    })
  });

  if (!profileResult.success) {
    console.log('❌ Profile update failed:', profileResult.error);
    return;
  }

  console.log('✅ Profile updated successfully!');

  // Step 3: Test login
  console.log('📝 Step 3: Testing login...');
  const loginResult = await makeRequest(`${BASE_URL}/api/clinic/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: clinicData.registration.email,
      password: clinicData.registration.password
    })
  });

  if (!loginResult.success) {
    console.log('❌ Login failed:', loginResult.error);
    return;
  }

  console.log('✅ Login successful! Status:', loginResult.data.clinic.status);

  // Step 4: Check admin panel
  console.log('📝 Step 4: Checking admin panel...');
  const adminResult = await makeRequest(`${BASE_URL}/api/clinic/list`);

  if (!adminResult.success) {
    console.log('❌ Admin check failed:', adminResult.error);
    return;
  }

  const clinics = adminResult.data.clinics || [];
  const ourClinic = clinics.find(c => c.clinic_id === clinicId);
  
  if (ourClinic) {
    console.log('✅ Clinic found in admin panel!');
    console.log('   Name:', ourClinic.clinic_name);
    console.log('   Status:', ourClinic.status);
  } else {
    console.log('❌ Clinic not found in admin panel');
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🎉 CLINIC CREATION COMPLETE!');
  console.log('=' .repeat(50));
  console.log('📋 Clinic Details:');
  console.log('   Name: Ayurvedic Lifestyle');
  console.log('   Owner: Dr. Rajesh Kumar Sharma');
  console.log('   Email: ayurvedic.lifestyle@clinic.com');
  console.log('   Phone: +91-9876543210');
  console.log('   Address: Plot No.: N5-28, 1st Floor ID Market Road, opposite Govt. High School, beside Radhika, IRC Village, Nayapalli, Bhubaneswar, Odisha 751015');
  console.log('   City: Bhubaneswar');
  console.log('   Distance: ~25 min by car');
  console.log('   Rating: 4.9 (220 reviews)');
  console.log('   Therapies: From ₹500');
  console.log('\n📋 Next Steps:');
  console.log('1. Go to: http://localhost:3000/admin');
  console.log('2. Find "Ayurvedic Lifestyle" clinic');
  console.log('3. Click "Approve" to activate the clinic');
  console.log('4. Clinic can then login at: http://localhost:3000/clinic-login');
  console.log('\n🔑 Login Credentials:');
  console.log('   Email: ayurvedic.lifestyle2@clinic.com');
  console.log('   Password: clinic123');
}

// Run the script
createClinic().catch(console.error);

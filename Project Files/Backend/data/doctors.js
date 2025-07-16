const doctors = [
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'password',
    specialty: 'General Physician',
    qualifications: ['MD'],
    experience: 8,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0105',
    location: 'Mumbai, India',
    rating: 4.8,
    numReviews: 127,
    reviews: [
      {
        name: 'Rahul Mehta',
        rating: 5,
        comment: 'Dr. Sharma is excellent! She took the time to listen to all my concerns and provided clear explanations. Highly recommended!'
      },
      {
        name: 'Priya Patel',
        rating: 4,
        comment: 'Very professional and caring doctor. The clinic is clean and staff is friendly.'
      },
      {
        name: 'Amit Shah',
        rating: 5,
        comment: 'Dr. Sharma diagnosed my condition quickly and the treatment worked perfectly. Great experience!'
      }
    ]
  },
  {
    name: 'Dr. Ramesh Patel',
    email: 'ramesh.patel@example.com',
    password: 'password',
    specialty: 'Cardiologist',
    qualifications: ['MD', 'FACC'],
    experience: 18,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0106',
    location: 'Delhi, India',
    rating: 4.9,
    numReviews: 203,
    reviews: [
      {
        name: 'Suresh Kumar',
        rating: 5,
        comment: 'Dr. Patel is one of the best cardiologists I have ever met. His expertise and bedside manner are exceptional.'
      },
      {
        name: 'Meera Singh',
        rating: 5,
        comment: 'Saved my father\'s life with his quick diagnosis. Forever grateful for his expertise and care.'
      },
      {
        name: 'Vikram Malhotra',
        rating: 4,
        comment: 'Very knowledgeable doctor. Takes time to explain everything clearly. Highly recommended for heart issues.'
      }
    ]
  },
  {
    name: 'Dr. Anjali Reddy',
    email: 'anjali.reddy@example.com',
    password: 'password',
    specialty: 'Pediatrician',
    qualifications: ['MD', 'FAAP'],
    experience: 11,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0107',
    location: 'Bangalore, India',
    rating: 4.7,
    numReviews: 156,
    reviews: [
      {
        name: 'Kavya Sharma',
        rating: 5,
        comment: 'Dr. Reddy is amazing with kids! My daughter actually looks forward to her checkups. Very patient and caring.'
      },
      {
        name: 'Rajesh Nair',
        rating: 4,
        comment: 'Great pediatrician. Always available when we need her and provides excellent care for our children.'
      },
      {
        name: 'Sunita Gupta',
        rating: 5,
        comment: 'Dr. Reddy has been our family pediatrician for years. She\'s knowledgeable, caring, and always puts children at ease.'
      }
    ]
  },
  {
    name: 'Dr. Suresh Kumar',
    email: 'suresh.kumar@example.com',
    password: 'password',
    specialty: 'Orthopedic',
    qualifications: ['MD', 'FACS'],
    experience: 22,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0108',
    location: 'Chennai, India',
    rating: 4.6,
    numReviews: 189,
    reviews: [
      {
        name: 'Arun Desai',
        rating: 4,
        comment: 'Dr. Kumar is very experienced in orthopedic surgery. He fixed my knee problem and I\'m back to normal activities.'
      },
      {
        name: 'Lakshmi Iyer',
        rating: 5,
        comment: 'Excellent surgeon! My shoulder surgery went perfectly and recovery was faster than expected.'
      },
      {
        name: 'Mohan Rao',
        rating: 4,
        comment: 'Very professional and skilled orthopedic surgeon. The staff is also very helpful and caring.'
      }
    ]
  },
  {
    name: 'Dr. Meera Joshi',
    email: 'meera.joshi@example.com',
    password: 'password',
    specialty: 'Dermatologist',
    qualifications: ['MD', 'FAAD'],
    experience: 7,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0109',
    location: 'Pune, India',
    rating: 4.5,
    numReviews: 98,
    reviews: [
      {
        name: 'Anjali Deshmukh',
        rating: 4,
        comment: 'Dr. Joshi helped clear my acne problem completely. Very knowledgeable about skin conditions.'
      },
      {
        name: 'Rahul Kulkarni',
        rating: 5,
        comment: 'Great dermatologist! She diagnosed my skin issue quickly and the treatment was very effective.'
      },
      {
        name: 'Priya More',
        rating: 4,
        comment: 'Professional and caring. Takes time to explain treatments and always follows up on progress.'
      }
    ]
  },
  {
    name: 'Dr. Vikas Malhotra',
    email: 'vikas.malhotra@example.com',
    password: 'password',
    specialty: 'Neurologist',
    qualifications: ['MD'],
    experience: 16,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0110',
    location: 'Hyderabad, India',
    rating: 4.8,
    numReviews: 134,
    reviews: [
      {
        name: 'Srinivas Reddy',
        rating: 5,
        comment: 'Dr. Malhotra is an excellent neurologist. He helped diagnose my condition and the treatment has been very effective.'
      },
      {
        name: 'Lakshmi Devi',
        rating: 4,
        comment: 'Very knowledgeable and patient. Takes time to explain complex neurological conditions in simple terms.'
      },
      {
        name: 'Ramesh Kumar',
        rating: 5,
        comment: 'Outstanding doctor! His expertise in neurology is exceptional and he\'s very caring towards patients.'
      }
    ]
  },
  {
    name: 'Dr. Sunita Gupta',
    email: 'sunita.gupta@example.com',
    password: 'password',
    specialty: 'Gynecologist',
    qualifications: ['MD'],
    experience: 14,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0111',
    location: 'Kolkata, India',
    rating: 4.7,
    numReviews: 167,
    reviews: [
      {
        name: 'Mita Sen',
        rating: 5,
        comment: 'Dr. Gupta is wonderful! She delivered my baby and the entire experience was amazing. Very caring and professional.'
      },
      {
        name: 'Ritika Das',
        rating: 4,
        comment: 'Excellent gynecologist. She makes you feel comfortable and explains everything clearly. Highly recommended!'
      },
      {
        name: 'Ananya Banerjee',
        rating: 5,
        comment: 'Dr. Gupta has been my gynecologist for years. She\'s knowledgeable, caring, and always puts patients first.'
      }
    ]
  },
  {
    name: 'Dr. Rajesh Nair',
    email: 'rajesh.nair@example.com',
    password: 'password',
    specialty: 'ENT Specialist',
    qualifications: ['MD'],
    experience: 9,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0112',
    location: 'Ahmedabad, India',
    rating: 4.4,
    numReviews: 89,
    reviews: [
      {
        name: 'Harsh Patel',
        rating: 4,
        comment: 'Dr. Nair treated my sinus problem effectively. The clinic is well-equipped and staff is friendly.'
      },
      {
        name: 'Neha Shah',
        rating: 4,
        comment: 'Good ENT specialist. He diagnosed my hearing issue and the treatment worked well.'
      },
      {
        name: 'Amit Trivedi',
        rating: 5,
        comment: 'Very professional and skilled. Fixed my throat problem quickly and painlessly.'
      }
    ]
  },
  {
    name: 'Dr. Margabandhu Saravanan',
    email: 'margabandhu.saravanan@example.com',
    password: 'password',
    specialty: 'Nephrologist',
    qualifications: ['MBBS', 'MD', 'DM (Nephro)', 'DNB (Nephro)'],
    experience: 12,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0113',
    location: 'Chennai, India',
    rating: 4.9,
    numReviews: 150,
    reviews: []
  },
  {
    name: 'Dr. Raghunath C N',
    email: 'raghunath.cn@example.com',
    password: 'password',
    specialty: 'Paediatric – General',
    qualifications: ['MBBS', 'MD (Paediatrics)'],
    experience: 15, // Assuming experience based on recognition
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0114',
    location: 'Bangalore, India',
    rating: 4.8,
    numReviews: 180,
    reviews: []
  },
  {
    name: 'Dr. S S Kamath',
    email: 'ss.kamath@example.com',
    password: 'password',
    specialty: 'Paediatrician',
    qualifications: ['MBBS', 'MD (Paediatrics)'],
    experience: 20, // Assuming experience based on recognition
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0115',
    location: 'Kochi, India',
    rating: 4.7,
    numReviews: 160,
    reviews: []
  },
  {
    name: 'Dr. Manoj Kumar Agarwala',
    email: 'manoj.agarwala@example.com',
    password: 'password',
    specialty: 'Cardiologist',
    qualifications: ['MBBS', 'MD', 'DM'],
    experience: 30,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0116',
    location: 'Hyderabad, India',
    rating: 4.9,
    numReviews: 250,
    reviews: []
  },
  {
    name: 'Dr. Aravinthan R',
    email: 'aravinthan.r@example.com',
    password: 'password',
    specialty: 'General Physician/Internal Med',
    qualifications: ['MBBS', 'DNB General Medicine'],
    experience: 6,
    consultationHours: { start: '09:00', end: '17:00' },
    profileImageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    contactPhone: '555-0117',
    location: 'Coimbatore, India',
    rating: 4.6,
    numReviews: 90,
    reviews: []
  }
];

module.exports = doctors; 
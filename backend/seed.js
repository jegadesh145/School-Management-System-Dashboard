const mongoose = require('mongoose');
const Student  = require('./models/Student');
const Teacher  = require('./models/Teacher');
const Book     = require('./models/Book');
const Notice   = require('./models/Notice');
require('dotenv').config();

const students = [
  { name: 'Aarav Kumar',    rollNo: '001', class: 'CSE', section: 'A', phone: '9876543210', gender: 'Male',   email: 'aarav@school.edu',    address: 'Chennai',   dateOfBirth: '2005-03-12' },
  { name: 'Arjun Singh',    rollNo: '002', class: 'CSE', section: 'A', phone: '9876543211', gender: 'Male',   email: 'arjun@school.edu',    address: 'Delhi',     dateOfBirth: '2005-07-21' },
  { name: 'Aditya Sharma',  rollNo: '003', class: 'CSE', section: 'A', phone: '9876543212', gender: 'Male',   email: 'aditya@school.edu',   address: 'Mumbai',    dateOfBirth: '2005-01-05' },
  { name: 'Ananya Reddy',   rollNo: '004', class: 'CSE', section: 'A', phone: '9876543213', gender: 'Female', email: 'ananya@school.edu',   address: 'Hyderabad', dateOfBirth: '2005-09-14' },
  { name: 'Bhavya Patel',   rollNo: '005', class: 'CSE', section: 'A', phone: '9876543214', gender: 'Female', email: 'bhavya@school.edu',   address: 'Ahmedabad', dateOfBirth: '2005-11-30' },
  { name: 'Bharath Kumar',  rollNo: '006', class: 'CSE', section: 'A', phone: '9876543215', gender: 'Male',   email: 'bharath@school.edu',  address: 'Bangalore', dateOfBirth: '2005-04-18' },
  { name: 'Charan Raj',     rollNo: '007', class: 'CSE', section: 'A', phone: '9876543216', gender: 'Male',   email: 'charan@school.edu',   address: 'Coimbatore',dateOfBirth: '2005-06-22' },
  { name: 'Divya Nair',     rollNo: '008', class: 'CSE', section: 'A', phone: '9876543217', gender: 'Female', email: 'divya@school.edu',    address: 'Kochi',     dateOfBirth: '2005-02-08' },
  { name: 'Deepak Yadav',   rollNo: '009', class: 'CSE', section: 'A', phone: '9876543218', gender: 'Male',   email: 'deepak@school.edu',   address: 'Jaipur',    dateOfBirth: '2005-08-15' },
  { name: 'Esha Gupta',     rollNo: '010', class: 'CSE', section: 'A', phone: '9876543219', gender: 'Female', email: 'esha@school.edu',     address: 'Lucknow',   dateOfBirth: '2005-05-27' },
  { name: 'Farhan Ali',     rollNo: '011', class: 'CSE', section: 'A', phone: '9876543220', gender: 'Male',   email: 'farhan@school.edu',   address: 'Pune',      dateOfBirth: '2005-12-03' },
  { name: 'Gokul Krishna',  rollNo: '012', class: 'CSE', section: 'A', phone: '9876543221', gender: 'Male',   email: 'gokul@school.edu',    address: 'Madurai',   dateOfBirth: '2005-10-11' },
  { name: 'Harini S',       rollNo: '013', class: 'CSE', section: 'A', phone: '9876543222', gender: 'Female', email: 'harini@school.edu',   address: 'Salem',     dateOfBirth: '2006-01-19' },
  { name: 'Ishaan Verma',   rollNo: '014', class: 'CSE', section: 'A', phone: '9876543223', gender: 'Male',   email: 'ishaan@school.edu',   address: 'Kanpur',    dateOfBirth: '2005-03-25' },
  { name: 'Jega Desh',      rollNo: '015', class: 'CSE', section: 'A', phone: '9876543224', gender: 'Male',   email: 'jega@school.edu',     address: 'Chennai',   dateOfBirth: '2005-07-07' },
  { name: 'Karthik R',      rollNo: '016', class: 'CSE', section: 'A', phone: '9876543225', gender: 'Male',   email: 'karthik@school.edu',  address: 'Trichy',    dateOfBirth: '2005-09-09' },
  { name: 'Lakshmi Priya',  rollNo: '017', class: 'CSE', section: 'A', phone: '9876543226', gender: 'Female', email: 'lakshmi@school.edu',  address: 'Vellore',   dateOfBirth: '2005-11-02' },
  { name: 'Manoj Kumar',    rollNo: '018', class: 'CSE', section: 'A', phone: '9876543227', gender: 'Male',   email: 'manoj@school.edu',    address: 'Agra',      dateOfBirth: '2005-04-30' },
  { name: 'Naveen Raj',     rollNo: '019', class: 'CSE', section: 'A', phone: '9876543228', gender: 'Male',   email: 'naveen@school.edu',   address: 'Mysore',    dateOfBirth: '2005-06-16' },
  { name: 'Nisha Sharma',   rollNo: '020', class: 'CSE', section: 'A', phone: '9876543229', gender: 'Female', email: 'nisha@school.edu',    address: 'Surat',     dateOfBirth: '2005-08-23' },
  { name: 'Om Prakash',     rollNo: '021', class: 'CSE', section: 'A', phone: '9876543230', gender: 'Male',   email: 'om@school.edu',       address: 'Bhopal',    dateOfBirth: '2005-02-14' },
  { name: 'Pooja Singh',    rollNo: '022', class: 'CSE', section: 'A', phone: '9876543231', gender: 'Female', email: 'pooja@school.edu',    address: 'Patna',     dateOfBirth: '2005-10-28' },
  { name: 'Praveen K',      rollNo: '023', class: 'CSE', section: 'A', phone: '9876543232', gender: 'Male',   email: 'praveen@school.edu',  address: 'Erode',     dateOfBirth: '2005-12-17' },
  { name: 'Rahul Das',      rollNo: '024', class: 'CSE', section: 'A', phone: '9876543233', gender: 'Male',   email: 'rahul@school.edu',    address: 'Kolkata',   dateOfBirth: '2005-05-04' },
  { name: 'Riya Patel',     rollNo: '025', class: 'CSE', section: 'A', phone: '9876543234', gender: 'Female', email: 'riya@school.edu',     address: 'Vadodara',  dateOfBirth: '2006-01-31' },
  { name: 'Sanjay Kumar',   rollNo: '026', class: 'CSE', section: 'A', phone: '9876543235', gender: 'Male',   email: 'sanjay@school.edu',   address: 'Nashik',    dateOfBirth: '2005-07-13' },
  { name: 'Sneha Reddy',    rollNo: '027', class: 'CSE', section: 'A', phone: '9876543236', gender: 'Female', email: 'sneha@school.edu',    address: 'Warangal',  dateOfBirth: '2005-03-06' },
  { name: 'Surya Prakash',  rollNo: '028', class: 'CSE', section: 'A', phone: '9876543237', gender: 'Male',   email: 'surya@school.edu',    address: 'Vijayawada',dateOfBirth: '2005-09-20' },
  { name: 'Tarun V',        rollNo: '029', class: 'CSE', section: 'A', phone: '9876543238', gender: 'Male',   email: 'tarun@school.edu',    address: 'Tirupati',  dateOfBirth: '2005-11-24' },
  { name: 'Tejaswini K',    rollNo: '030', class: 'CSE', section: 'A', phone: '9876543239', gender: 'Female', email: 'tejaswini@school.edu',address: 'Nellore',   dateOfBirth: '2006-02-10' },
  { name: 'Uday Kumar',     rollNo: '031', class: 'CSE', section: 'A', phone: '9876543240', gender: 'Male',   email: 'uday@school.edu',     address: 'Guntur',    dateOfBirth: '2005-04-03' },
  { name: 'Varun Singh',    rollNo: '032', class: 'CSE', section: 'A', phone: '9876543241', gender: 'Male',   email: 'varun@school.edu',    address: 'Noida',     dateOfBirth: '2005-06-29' },
  { name: 'Vignesh S',      rollNo: '033', class: 'CSE', section: 'A', phone: '9876543242', gender: 'Male',   email: 'vignesh@school.edu',  address: 'Tirunelveli',dateOfBirth:'2005-08-07' },
  { name: 'Yash Patel',     rollNo: '034', class: 'CSE', section: 'A', phone: '9876543243', gender: 'Male',   email: 'yash@school.edu',     address: 'Rajkot',    dateOfBirth: '2005-10-15' },
  { name: 'Zara Khan',      rollNo: '035', class: 'CSE', section: 'A', phone: '9876543244', gender: 'Female', email: 'zara@school.edu',     address: 'Lucknow',   dateOfBirth: '2005-12-26' },
];

const teachers = [
  { name: 'Dr. Ramesh Kumar',    employeeId: 'T001', subject: 'Mathematics',      class: 'CSE', phone: '9811001001', email: 'ramesh@school.edu',   qualification: 'Ph.D Mathematics', gender: 'Male',   joinDate: '2018-06-01', status: 'Active' },
  { name: 'Mrs. Priya Iyer',     employeeId: 'T002', subject: 'Physics',           class: 'CSE', phone: '9811001002', email: 'priya@school.edu',    qualification: 'M.Sc Physics',     gender: 'Female', joinDate: '2019-07-15', status: 'Active' },
  { name: 'Mr. Suresh Babu',     employeeId: 'T003', subject: 'Chemistry',         class: 'CSE', phone: '9811001003', email: 'suresh@school.edu',   qualification: 'M.Sc Chemistry',   gender: 'Male',   joinDate: '2017-04-10', status: 'Active' },
  { name: 'Ms. Kavitha Menon',   employeeId: 'T004', subject: 'Computer Science',  class: 'CSE', phone: '9811001004', email: 'kavitha@school.edu',  qualification: 'M.Tech CSE',       gender: 'Female', joinDate: '2020-08-01', status: 'Active' },
  { name: 'Mr. Arun Prakash',    employeeId: 'T005', subject: 'English',           class: 'CSE', phone: '9811001005', email: 'arun@school.edu',     qualification: 'M.A English',      gender: 'Male',   joinDate: '2016-05-20', status: 'Active' },
  { name: 'Mrs. Deepa Nair',     employeeId: 'T006', subject: 'Biology',           class: 'ECE', phone: '9811001006', email: 'deepa@school.edu',    qualification: 'M.Sc Biology',     gender: 'Female', joinDate: '2021-01-10', status: 'Active' },
  { name: 'Mr. Vijay Sharma',    employeeId: 'T007', subject: 'History',           class: 'MECH',phone: '9811001007', email: 'vijay@school.edu',    qualification: 'M.A History',      gender: 'Male',   joinDate: '2015-09-05', status: 'Active' },
  { name: 'Ms. Rekha Singh',     employeeId: 'T008', subject: 'Geography',         class: 'CIVIL',phone: '9811001008',email: 'rekha@school.edu',    qualification: 'M.A Geography',    gender: 'Female', joinDate: '2022-03-15', status: 'Active' },
];

const books = [
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', quantity: 5,  available: 3, publishedYear: '2009', status: 'Available' },
  { title: 'The Pragmatic Programmer',   author: 'Andrew Hunt',      isbn: '978-0135957059', category: 'Programming',      quantity: 3,  available: 2, publishedYear: '2019', status: 'Available' },
  { title: 'Clean Code',                 author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Programming',      quantity: 4,  available: 4, publishedYear: '2008', status: 'Available' },
  { title: 'Design Patterns',            author: 'Gang of Four',     isbn: '978-0201633610', category: 'Software Design',  quantity: 2,  available: 1, publishedYear: '1994', status: 'Available' },
  { title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1285741550', category: 'Mathematics', quantity: 10, available: 7, publishedYear: '2015', status: 'Available' },
  { title: 'Concepts of Physics',        author: 'H.C. Verma',       isbn: '978-8177091878', category: 'Physics',          quantity: 8,  available: 6, publishedYear: '2011', status: 'Available' },
  { title: 'Organic Chemistry',          author: 'Morrison Boyd',    isbn: '978-0136552949', category: 'Chemistry',        quantity: 6,  available: 5, publishedYear: '2010', status: 'Available' },
  { title: 'English Grammar in Use',     author: 'Raymond Murphy',   isbn: '978-1107539334', category: 'English',          quantity: 12, available: 9, publishedYear: '2019', status: 'Available' },
];

const notices = [
  { title: 'Annual Sports Day',         content: 'Annual Sports Day will be held on 15th May 2026. All students are requested to participate.', category: 'Event',   audience: 'All',      publishedDate: '2026-04-25', isActive: true },
  { title: 'Exam Schedule Released',    content: 'The final exam schedule for Semester 2 has been released. Check the notice board for details.', category: 'Exam',  audience: 'Students', publishedDate: '2026-04-24', isActive: true },
  { title: 'Fee Payment Reminder',      content: 'Last date for fee payment is 30th April 2026. Please pay your fees to avoid late charges.',  category: 'General', audience: 'Parents',  publishedDate: '2026-04-22', isActive: true },
  { title: 'Staff Meeting',             content: 'Mandatory staff meeting on 28th April at 3:00 PM in the conference hall.',                    category: 'General', audience: 'Teachers', publishedDate: '2026-04-20', isActive: true },
  { title: 'Summer Vacation Notice',    content: 'Summer vacation starts from 1st June 2026. School reopens on 15th July 2026.',                category: 'Holiday', audience: 'All',      publishedDate: '2026-04-18', isActive: true },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  await Student.deleteMany({});
  await Teacher.deleteMany({});
  await Book.deleteMany({});
  await Notice.deleteMany({});

  await Student.insertMany(students);
  console.log(`✅ ${students.length} students seeded`);

  await Teacher.insertMany(teachers);
  console.log(`✅ ${teachers.length} teachers seeded`);

  await Book.insertMany(books);
  console.log(`✅ ${books.length} books seeded`);

  await Notice.insertMany(notices);
  console.log(`✅ ${notices.length} notices seeded`);

  console.log('\n🎉 Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });

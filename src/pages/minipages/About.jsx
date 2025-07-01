
import React, { useState } from 'react';

const universities = [
  {
    name: "Jacksonville State University (JSU)",
    location: "Jacksonville, Alabama",
    ranking: 697,
    acceptanceRate: "64%",
    tuition: "$24,230",
    minGPA: 2.5,
    minSAT: 980,
    minACT: 19,
    minIELTS: 6.0,
    majors: ["Business", "Nursing", "Education", "Computer Science", "Engineering Technology"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "Southern", "Community-Oriented"],
    website: "https://springfall-usa.vercel.app/blogs/68298c505022bb8a6efc5548"
  },
  {
    name: "Middle Tennessee State University (MTSU)",
    location: "Murfreesboro, Tennessee",
    ranking: 293,
    acceptanceRate: "94%",
    tuition: "$12,200",
    minGPA: 2.5,
    minSAT: 1100,
    minACT: 22,
    minIELTS: 5.5,
    majors: ["Aerospace", "Business", "Music", "Mechatronics Engineering", "Psychology", "Media & Entertainment"],
    acceptanceLevel: "very high",
    type: "public",
    financialAid: "generous (up to $16,000/year)",
    tags: ["Affordable", "Supportive", "Cultural Diversity", "STEM-Friendly"],
    website: "https://springfall-usa.vercel.app/blogs/68315b9e32f5a705c0e436a2"
  },
  {
    name: "University of Wisconsin-Green Bay",
    location: "Green Bay, Wisconsin",
    ranking: 537,
    acceptanceRate: "84%",
    tuition: "$17,300",
    minGPA: 2.75,
    minSAT: 1030,
    minACT: 20,
    minIELTS: 6.0,
    majors: ["Psychology", "Business", "Nursing", "Environmental Science", "Computer Science"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Eco Campus", "Affordable", "Safe Community"],
    website: "https://springfall-usa.vercel.app/blogs/6826dce8b870a0f044dbc0cd"
  },
  {
    name: "University of Wisconsin-Superior",
    location: "Superior, Wisconsin",
    ranking: 931,
    acceptanceRate: "82%",
    tuition: "$16,930",
    minGPA: 2.5,
    minSAT: 980,
    minACT: 19,
    minIELTS: 6.0,
    majors: ["Business", "Education", "Computer Science", "Health Sciences", "Social Work"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Small Classes", "Affordable", "Liberal Arts"],
    website: "https://springfall-usa.vercel.app/blogs/6826d33fb870a0f044dbc040"
  },
  {
    name: "McNeese State University",
    location: "Lake Charles, Louisiana",
    ranking: 861,
    acceptanceRate: "63%",
    tuition: "$12,500",
    minGPA: 2.5,
    minSAT: 980,
    minACT: 19,
    minIELTS: 6.0,
    majors: ["Engineering", "Nursing", "Education", "Business", "Agriculture"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "STEM Focus", "Southern"],
    website: "https://springfall-usa.vercel.app/blogs/6824bb70c5f80929f4d5d37d"
  },
  {
    name: "Louisiana Tech University",
    location: "Ruston, Louisiana",
    ranking: 324,
    acceptanceRate: "64%",
    tuition: "$21,894",
    minGPA: 2.75,
    minSAT: 1100,
    minACT: 22,
    minIELTS: 6.5,
    majors: ["Engineering", "Business", "Computer Science", "Architecture", "Education"],
    acceptanceLevel: "medium",
    type: "public",
    financialAid: "limited",
    tags: ["Tech Focus", "Affordable", "Public Research"],
    website: "https://springfall-usa.vercel.app/blogs/682475472c6f25f9e777d840"
  },
  {
    name: "Weber State University",
    location: "Ogden, Utah",
    ranking: 425,
    acceptanceRate: "100%",
    tuition: "$17,545",
    minGPA: 2.5,
    minSAT: 1000,
    minACT: 20,
    minIELTS: 6.0,
    majors: ["Nursing", "Engineering", "Business", "Computer Science", "Education"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Open Admission", "Affordable", "Utah Public"],
    website: "https://springfall-usa.vercel.app/blogs/682088009c81af52ecd7c45d"
  },
  {
    name: "University of Texas at Arlington (UTA)",
    location: "Arlington, Texas",
    ranking: 158,
    acceptanceRate: "88%",
    tuition: "$11,786",
    minGPA: 2.75,
    minSAT: 1100,
    minACT: 22,
    minIELTS: 6.5,
    majors: ["Engineering", "Nursing", "Business", "Architecture", "Computer Science"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Urban", "Diverse", "Research-Oriented"],
    website: "https://springfall-usa.vercel.app/blogs/681dec66ce3277f5baea6e69"
  },
  {
    name: "Idaho State University (ISU)",
    location: "Pocatello, Idaho",
    ranking: 331,
    acceptanceRate: "100%",
    tuition: "$27,466",
    minGPA: 2.25,
    minSAT: 1015,
    minACT: 22,
    minIELTS: 5.5,
    majors: ["Nursing", "Health Sciences", "Engineering", "Business", "Education", "Computer Science", "Pharmacy", "Psychology", "Liberal Arts"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Health-Focused", "Research", "Affordable"],
    website: "https://springfall-usa.vercel.app/blogs/681deb7cce3277f5baea6e5b"
  },
  {
    name: "Texas State University (TXST)",
    location: "San Marcos, Texas",
    ranking: 208,
    acceptanceRate: "89%",
    tuition: "$10,000",
    minGPA: 3.0,
    minSAT: 1080,
    minACT: 22,
    minIELTS: 6.5,
    majors: ["Business", "Chemistry", "Computer Science", "Economics", "Engineering", "Environmental Science", "Liberal Arts & Social Sciences", "Mathematics", "Medicine", "Physics", "Psychology", "Education", "Health Sciences", "Social Work"],
    acceptanceLevel: "medium",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "Research", "Hill Country Campus"],
    website: "https://springfall-usa.vercel.app/blogs/681dd63f481b8bf3f0432214"
  },
  {
    name: "Arkansas State University (ASU)",
    location: "Jonesboro, Arkansas",
    ranking: 396,
    acceptanceRate: "67%",
    tuition: "$11,820",
    minGPA: 2.5,
    minSAT: 980,
    minACT: 19,
    minIELTS: 6.0,
    majors: ["Business", "Nursing", "Education", "Engineering", "Computer Science"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "Southern", "Friendly Campus"],
    website: "https://springfall-usa.vercel.app/blogs/681da10ba6683ec206d4001c"
  },
  {
    name: "Caldwell University",
    location: "Caldwell, New Jersey",
    ranking: 254,
    acceptanceRate: "97%",
    tuition: "$38,500",
    minGPA: 2.5,
    minSAT: 990,
    minACT: 19,
    minIELTS: 6.0,
    majors: ["Business", "Nursing", "Psychology", "Computer Science", "Education"],
    acceptanceLevel: "very high",
    type: "private",
    financialAid: "limited",
    tags: ["Catholic", "Liberal Arts", "Small Campus"],
    website: "https://springfall-usa.vercel.app/blogs/6841a12bc93f4acbbebf45d2"
  },
  {
    name: "Dakota State University (DSU)",
    location: "Madison, South Dakota",
    ranking: 295,
    acceptanceRate: "83%",
    tuition: "$12,600",
    minGPA: 2.5,
    minSAT: 1000,
    minACT: 20,
    minIELTS: 6.0,
    majors: ["Cybersecurity", "Computer Science", "Business", "Health Informatics", "Education"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Tech Focus", "Affordable", "STEM-Friendly"],
    website: "https://springfall-usa.vercel.app/blogs/6841a58ec93f4acbbebf47b5"
  },
  {
    name: "Southeast Missouri State University (SEMO)",
    location: "Cape Girardeau, Missouri",
    ranking: 331,
    acceptanceRate: "86%",
    tuition: "$16,000",
    minGPA: 2.5,
    minSAT: 1020,
    minACT: 21,
    minIELTS: 6.0,
    majors: ["Business", "Education", "Nursing", "Computer Science", "Environmental Science"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Regional", "Affordable", "Safe Community"],
    website: "https://springfall-usa.vercel.app/blogs/6841a8fec93f4acbbebf48f7"
  },
  {
    name: "University of Southern Mississippi",
    location: "Hattiesburg, Mississippi",
    ranking: 332,
    acceptanceRate: "97%",
    tuition: "$11,500",
    minGPA: 2.5,
    minSAT: 1030,
    minACT: 21,
    minIELTS: 6.0,
    majors: ["Business", "Nursing", "Education", "Computer Science", "Social Sciences"],
    acceptanceLevel: "very high",
    type: "public",
    financialAid: "limited",
    tags: ["Research", "Southern", "Affordable"],
    website: "https://springfall-usa.vercel.app/blogs/6841acecc93f4acbbebf4a21"
  },
  {
    name: "Youngstown State University (YSU)",
    location: "Youngstown, Ohio",
    ranking: 382,
    acceptanceRate: "78%",
    tuition: "$10,300",
    minGPA: 2.5,
    minSAT: 1000,
    minACT: 20,
    minIELTS: 6.0,
    majors: ["Business", "Engineering", "Nursing", "Computer Science", "Education"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "Midwest", "Community-Oriented"],
    website: "https://springfall-usa.vercel.app/blogs/6841af9cc93f4acbbebf4b1f"
  },
  {
    name: "University of Louisiana at Monroe (ULM)",
    location: "Monroe, Louisiana",
    ranking: 419,
    acceptanceRate: "71%",
    tuition: "$12,500",
    minGPA: 2.5,
    minSAT: 1020,
    minACT: 20,
    minIELTS: 6.0,
    majors: ["Pharmacy", "Business", "Nursing", "Computer Science", "Education"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Southern", "Affordable", "Health Focus"],
    website: "https://springfall-usa.vercel.app/blogs/6841b1c8c93f4acbbebf4c0a"
  },
  {
    name: "University of North Carolina at Pembroke (UNCP)",
    location: "Pembroke, North Carolina",
    ranking: 450,
    acceptanceRate: "89%",
    tuition: "$8,900",
    minGPA: 2.5,
    minSAT: 1000,
    minACT: 19,
    minIELTS: 6.0,
    majors: ["Business", "Education", "Health Sciences", "Psychology", "Social Work"],
    acceptanceLevel: "very high",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "Community-Oriented", "Diversity"],
    website: "https://springfall-usa.vercel.app/blogs/6841b450c93f4acbbebf4d35"
  },
  {
    name: "Wright State University",
    location: "Dayton, Ohio",
    ranking: 365,
    acceptanceRate: "95%",
    tuition: "$20,000",
    minGPA: 2.5,
    minSAT: 1040,
    minACT: 21,
    minIELTS: 6.0,
    majors: ["Business", "Engineering", "Nursing", "Computer Science", "Education", "Psychology"],
    acceptanceLevel: "very high",
    type: "public",
    financialAid: "limited",
    tags: ["STEM-Friendly", "Affordable", "Urban"],
    website: "https://springfall-usa.vercel.app/blogs/6841b6a8c93f4acbbebf4e1b"
  },
  {
    name: "Lyon College",
    location: "Batesville, Arkansas",
    ranking: 458,
    acceptanceRate: "75%",
    tuition: "$31,500",
    minGPA: 2.75,
    minSAT: 1050,
    minACT: 21,
    minIELTS: 6.0,
    majors: ["Biology", "Business", "Psychology", "History", "Education"],
    acceptanceLevel: "medium",
    type: "private",
    financialAid: "generous (up to $18,000/year)",
    tags: ["Liberal Arts", "Private", "Community-Oriented"],
    website: "https://springfall-usa.vercel.app/blogs/6841ba04c93f4acbbebf4f4c"
  },
  {
    name: "University of South Dakota (USD)",
    location: "Vermillion, South Dakota",
    ranking: 321,
    acceptanceRate: "87%",
    tuition: "$12,800",
    minGPA: 2.5,
    minSAT: 1030,
    minACT: 21,
    minIELTS: 6.0,
    majors: ["Business", "Health Sciences", "Nursing", "Computer Science", "Law"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "Research", "Community-Oriented"],
    website: "https://springfall-usa.vercel.app/blogs/6841bd2dc93f4acbbebf507a"
  },
  {
    name: "University of Cincinnati (UC)",
    location: "Cincinnati, Ohio",
    ranking: 142,
    acceptanceRate: "86%",
    tuition: "$28,500",
    minGPA: 3.0,
    minSAT: 1150,
    minACT: 24,
    minIELTS: 6.5,
    majors: ["Engineering", "Business", "Health Sciences", "Computer Science", "Architecture"],
    acceptanceLevel: "medium",
    type: "public",
    financialAid: "limited",
    tags: ["Research", "Urban", "Public"],
    website: "https://springfall-usa.vercel.app/blogs/6841c12ec93f4acbbebf51b3"
  },
  {
    name: "Louisiana State University Shreveport (LSUS)",
    location: "Shreveport, Louisiana",
    ranking: 500,
    acceptanceRate: "84%",
    tuition: "$20,400",
    minGPA: 2.5,
    minSAT: 1020,
    minACT: 20,
    minIELTS: 6.0,
    majors: ["Business", "Health Sciences", "Computer Science", "Education", "Social Work"],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "Community-Oriented", "Southern"],
    website: "https://springfall-usa.vercel.app/blogs/6841c450c93f4acbbebf52f9"
  },
  {
    name: "Texas A&M University - College Station (TAMU)",
    location: "College Station, Texas",
    ranking: 67,
    acceptanceRate: "64%",
    tuition: "$39,800",
    minGPA: 3.0,
    minSAT: 1250,
    minACT: 26,
    minIELTS: 7.0,
    majors: ["Engineering", "Business", "Computer Science", "Agriculture", "Architecture", "Education"],
    acceptanceLevel: "medium",
    type: "public",
    financialAid: "limited",
    tags: ["Research", "STEM Focus", "Large Campus"],
    website: "https://springfall-usa.vercel.app/blogs/6841c7aec93f4acbbebf5434"
  }
];


const USAUniversityFinder = () => {
  const [gpa, setGpa] = useState('');
  const [ielts, setIelts] = useState('');
  const [major, setMajor] = useState('');
  const [budget, setBudget] = useState('');
  const [matches, setMatches] = useState([]);
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const findUniversities = () => {
    const g = parseFloat(gpa);
    const i = parseFloat(ielts);
    const b = budget;

    if (!g || !i || !major) {
      showNotification('Please enter GPA, IELTS, and select a major.');
      return;
    }

    if (g > 4 || g < 0 || i > 9 || i < 0) {
      showNotification('Please enter valid GPA (0-4) and IELTS (0-9)');
      return;
    }

    const filtered = universities.filter((uni) => {
      const gCheck = g >= uni.minGPA;
      const iCheck = i >= uni.minIELTS;
      const mCheck = uni.majors.includes(major);

      // ✅ FIXED BUDGET RANGE CHECK
      let lower = 0, upper = Infinity;
      if (b === "20000") upper = 20000;
      else if (b === "40000") { lower = 20000; upper = 40000; }
      else if (b === "60000") { lower = 40000; upper = 60000; }
      else if (b === "100000") lower = 60000;

      const tuition = parseInt(uni.tuition.replace(/[^0-9]/g, '')) || 0;
      const bCheck = tuition >= lower && tuition <= upper;

      return gCheck && iCheck && mCheck && bCheck;
    });

    setMatches(filtered.sort((a, b) => a.ranking - b.ranking));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 p-6 font-sans">
      {notification && (
        <div className="bg-red-500 text-white px-4 py-2 rounded shadow mb-4 text-center">
          {notification}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold mb-2 text-blue-800">University Search Engine</h1>
          <p className="text-md sm:text-lg">Find your perfect match among top American universities</p>
        </header>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-semibold mb-2">CGPA (0-4)</label>
              <input type="number" step="0.01" min="0" max="4" value={gpa} onChange={(e) => setGpa(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your GPA" />
            </div>
            <div>
              <label className="block font-semibold mb-2">IELTS Score</label>
              <input type="number" step="0.1" min="0" max="9" value={ielts} onChange={(e) => setIelts(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Enter your IELTS score" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Preferred Major</label>
              <select value={major} onChange={(e) => setMajor(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2">
                <option value="">Select a major</option>
                {Array.from(new Set(universities.flatMap(u => u.majors))).sort().map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Budget (Max Tuition USD)</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2">
                <option value="">No Limit</option>
                <option value="20000">Under $20,000</option>
                <option value="40000">$20,000 - $40,000</option>
                <option value="60000">$40,000 - $60,000</option>
                <option value="100000">$60,000+</option>
              </select>
            </div>
          </div>
          <button
            onClick={findUniversities}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full w-full hover:bg-blue-700 transition"
          >
            Find My Universities
          </button>
        </div>

        {/* Results Section */}
        {matches.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Matched Universities</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {matches.map((uni, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow border-t-4 border-blue-500 p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold">{uni.name}</h3>
                    <p className="text-sm text-gray-600">{uni.location}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span><strong>Rank:</strong> #{uni.ranking}</span>
                    <span><strong>Acceptance:</strong> {uni.acceptanceRate}</span>
                    <span><strong>Tuition:</strong> {uni.tuition}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {uni.tags.map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`font-semibold ${
                      uni.acceptanceLevel === 'high' ? 'text-green-600' :
                      uni.acceptanceLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {uni.acceptanceLevel.charAt(0).toUpperCase() + uni.acceptanceLevel.slice(1)} chance
                    </span>
                    {uni.website && (
                      <button
                        onClick={() => window.open(uni.website, '_blank')}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Learn More
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {matches.length === 0 && gpa && ielts && major && (
          <div className="mt-10 text-center text-gray-500">
            <p>No universities match your criteria. Try adjusting your inputs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default USAUniversityFinder;

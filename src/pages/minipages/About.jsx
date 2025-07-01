"use client"

import { useState, useEffect } from "react"
import {
  Sun,
  Moon,
  Search,
  Shuffle,
  MapPin,
  Star,
  GraduationCap,
  Users,
  ExternalLink,
  Mail,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"

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
    website: "https://springfall-usa.vercel.app/blogs/68298c505022bb8a6efc5548",
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
    website: "https://springfall-usa.vercel.app/blogs/68315b9e32f5a705c0e436a2",
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
    website: "https://springfall-usa.vercel.app/blogs/6826dce8b870a0f044dbc0cd",
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
    website: "https://springfall-usa.vercel.app/blogs/6826d33fb870a0f044dbc040",
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
    website: "https://springfall-usa.vercel.app/blogs/6824bb70c5f80929f4d5d37d",
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
    website: "https://springfall-usa.vercel.app/blogs/682475472c6f25f9e777d840",
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
    website: "https://springfall-usa.vercel.app/blogs/682088009c81af52ecd7c45d",
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
    website: "https://springfall-usa.vercel.app/blogs/681dec66ce3277f5baea6e69",
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
    majors: [
      "Nursing",
      "Health Sciences",
      "Engineering",
      "Business",
      "Education",
      "Computer Science",
      "Pharmacy",
      "Psychology",
      "Liberal Arts",
    ],
    acceptanceLevel: "high",
    type: "public",
    financialAid: "limited",
    tags: ["Health-Focused", "Research", "Affordable"],
    website: "https://springfall-usa.vercel.app/blogs/681deb7cce3277f5baea6e5b",
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
    majors: [
      "Business",
      "Chemistry",
      "Computer Science",
      "Economics",
      "Engineering",
      "Environmental Science",
      "Liberal Arts & Social Sciences",
      "Mathematics",
      "Medicine",
      "Physics",
      "Psychology",
      "Education",
      "Health Sciences",
      "Social Work",
    ],
    acceptanceLevel: "medium",
    type: "public",
    financialAid: "limited",
    tags: ["Affordable", "Research", "Hill Country Campus"],
    website: "https://springfall-usa.vercel.app/blogs/681dd63f481b8bf3f0432214",
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
    website: "https://springfall-usa.vercel.app/blogs/681da10ba6683ec206d4001c",
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
    website: "https://springfall-usa.vercel.app/blogs/6841a12bc93f4acbbebf45d2",
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
    website: "https://springfall-usa.vercel.app/blogs/6841a58ec93f4acbbebf47b5",
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
    website: "https://springfall-usa.vercel.app/blogs/6841a8fec93f4acbbebf48f7",
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
    website: "https://springfall-usa.vercel.app/blogs/6841acecc93f4acbbebf4a21",
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
    website: "https://springfall-usa.vercel.app/blogs/6841af9cc93f4acbbebf4b1f",
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
    website: "https://springfall-usa.vercel.app/blogs/6841b1c8c93f4acbbebf4c0a",
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
    website: "https://springfall-usa.vercel.app/blogs/6841b450c93f4acbbebf4d35",
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
    website: "https://springfall-usa.vercel.app/blogs/6841b6a8c93f4acbbebf4e1b",
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
    website: "https://springfall-usa.vercel.app/blogs/6841ba04c93f4acbbebf4f4c",
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
    website: "https://springfall-usa.vercel.app/blogs/6841bd2dc93f4acbbebf507a",
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
    website: "https://springfall-usa.vercel.app/blogs/6841c12ec93f4acbbebf51b3",
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
    website: "https://springfall-usa.vercel.app/blogs/6841c450c93f4acbbebf52f9",
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
    website: "https://springfall-usa.vercel.app/blogs/6841c7aec93f4acbbebf5434",
  },
]

const USAUniversityFinder = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [gpa, setGpa] = useState("")
  const [ielts, setIelts] = useState("")
  const [major, setMajor] = useState("")
  const [budget, setBudget] = useState("")
  const [matches, setMatches] = useState([])
  const [notification, setNotification] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const showNotification = (message, type = "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(""), 4000)
  }

  const findUniversities = () => {
    const g = Number.parseFloat(gpa)
    const i = Number.parseFloat(ielts)
    const b = budget

    if (!g || !i || !major) {
      showNotification("Please enter GPA, IELTS, and select a major.", "error")
      return
    }

    if (g > 4 || g < 0 || i > 9 || i < 0) {
      showNotification("Please enter valid GPA (0-4) and IELTS (0-9)", "error")
      return
    }

    setIsSearching(true)
    setShowResults(false)

    setTimeout(() => {
      const filtered = universities.filter((uni) => {
        const gCheck = g >= uni.minGPA
        const iCheck = i >= uni.minIELTS
        const mCheck = uni.majors.includes(major)

        let lower = 0,
          upper = Number.POSITIVE_INFINITY
        if (b === "20000") upper = 20000
        else if (b === "40000") {
          lower = 20000
          upper = 40000
        } else if (b === "60000") {
          lower = 40000
          upper = 60000
        } else if (b === "100000") lower = 60000

        const tuition = Number.parseInt(uni.tuition.replace(/[^0-9]/g, "")) || 0
        const bCheck = tuition >= lower && tuition <= upper

        return gCheck && iCheck && mCheck && bCheck
      })

      setMatches(filtered.sort((a, b) => a.ranking - b.ranking))
      setIsSearching(false)
      setShowResults(true)

      if (filtered.length > 0) {
        showNotification(`Found ${filtered.length} matching universities!`, "success")
      }
    }, 1500)
  }

  const surpriseMe = () => {
    if (!gpa || !ielts || !major) {
      showNotification("Please fill in your basic info first!", "error")
      return
    }

    const g = Number.parseFloat(gpa)
    const i = Number.parseFloat(ielts)

    const eligible = universities.filter((uni) => {
      return g >= uni.minGPA && i >= uni.minIELTS && uni.majors.includes(major)
    })

    if (eligible.length === 0) {
      showNotification("No universities match your basic criteria.", "error")
      return
    }

    const randomUni = eligible[Math.floor(Math.random() * eligible.length)]
    setMatches([randomUni])
    setShowResults(true)
    showNotification(`Here's a surprise match for you!`, "success")
  }

  const FloatingLabelInput = ({ label, type, value, onChange, min, max, step, placeholder }) => (
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder=" "
        className={`peer w-full px-4 py-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border-2 border-white/20 dark:border-gray-600/30 rounded-2xl text-gray-800 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl`}
      />
      <label
        className={`absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-semibold transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent`}
      >
        {label}
      </label>
    </div>
  )

  const FloatingLabelSelect = ({ label, value, onChange, options }) => (
    <div className="relative group">
      <select
        value={value}
        onChange={onChange}
        className={`peer w-full px-4 py-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border-2 border-white/20 dark:border-gray-600/30 rounded-2xl text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer`}
      >
        <option value="" className="bg-white dark:bg-gray-800">
          Select {label}
        </option>
        {options.map((option, i) => (
          <option key={i} value={option} className="bg-white dark:bg-gray-800">
            {option}
          </option>
        ))}
      </select>
      <label
        className={`absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-semibold transition-all duration-300 ${value ? "" : "peer-focus:-top-2.5 peer-focus:text-sm"}`}
      >
        {label}
      </label>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Background with parallax */}
      <div className="fixed inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-5 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fillOpacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-40 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg transform transition-all duration-500 ${
          notification.type === 'success' 
            ? 'bg-green-500/90 text-white border border-green-400/50' 
            : 'bg-red-500/90 text-white border border-red-400/50'
        } animate-slide-in-right`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UniMatch
              </h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 group"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Find Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                University Match
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover your ideal American university with our intelligent matching system. 
              Your academic journey starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>25+ Top Universities</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Smart Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>Nationwide Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Let's Find Your Match
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Enter your academic credentials and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <FloatingLabelInput
                label="CGPA (0-4)"
                type="number"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                min="0"
                max="4"
                step="0.01"
              />
              
              <FloatingLabelInput
                label="IELTS Score (0-9)"
                type="number"
                value={ielts}
                onChange={(e) => setIelts(e.target.value)}
                min="0"
                max="9"
                step="0.1"
              />

              <FloatingLabelSelect
                label="Preferred Major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                options={Array.from(new Set(universities.flatMap(u => u.majors))).sort()}
              />

              <FloatingLabelSelect
                label="Budget Range (USD)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                options={[
                  "Under $20,000",
                  "$20,000 - $40,000", 
                  "$40,000 - $60,000",
                  "$60,000+"
                ].map((label, i) => ({ 
                  label, 
                  value: ["20000", "40000", "60000", "100000"][i] 
                })).map(opt => opt.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={findUniversities}
                disabled={isSearching}
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-3">
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Find My Universities</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={surpriseMe}
                className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-3">
                  <Shuffle className="w-5 h-5" />
                  <span className="hidden sm:inline">Surprise Me!</span>
                  <span className="sm:hidden">Surprise</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Your University Matches
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {matches.length > 0 
                  ? `Found ${matches.length} universities that match your criteria`
                  : 'No universities match your current criteria. Try adjusting your filters.'
                }
              </p>
            </div>

            {matches.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((uni, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/10 dark:bg-gray-800/10 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-slide-in-up overflow-hidden"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* University Header */}
                    <div className="p-6 border-b border-white/10 dark:border-gray-700/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {uni.name}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{uni.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            #{uni.ranking}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Ranking</div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-white/5 dark:bg-gray-700/20 rounded-xl">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {uni.acceptanceRate}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Acceptance</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 dark:bg-gray-700/20 rounded-xl">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {uni.tuition}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Tuition</div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <div>Min GPA: <span className="font-semibold">{uni.minGPA}</span></div>
                        <div>Min IELTS: <span className="font-semibold">{uni.minIELTS}</span></div>
                      </div>
                    </div>

                    {/* University Body */}
                    <div className="p-6">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {uni.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Acceptance Level */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Admission Chance:</span>
                        <span className={`font-bold text-sm px-3 py-1 rounded-full ${
                          uni.acceptanceLevel === 'high' || uni.acceptanceLevel === 'very high'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : uni.acceptanceLevel === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {uni.acceptanceLevel.charAt(0).toUpperCase() + uni.acceptanceLevel.slice(1)}
                        </span>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => window.open(uni.website, '_blank')}
                        className="w-full group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <span>Learn More</span>
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : showResults && (
              <div className="text-center py-20 animate-fade-in-up">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
                  No matches found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Try adjusting your criteria or use the "Surprise Me" button to discover new possibilities.
                </p>
                <button
                  onClick={surpriseMe}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Try Surprise Me!
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 dark:bg-gray-900/20 backdrop-blur-lg border-t border-white/10 dark:border-gray-700/20 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UniMatch
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Empowering students to find their perfect university match through intelligent algorithms and comprehensive data.
            </p>

            <div className="flex justify-center gap-6 mb-8">
              <a
                href="mailto:contact@unimatch.com"
                className="group p-3 bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/40 transition-all duration-300"
              >
                <Mail className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/40 transition-all duration-300"
              >
                <Github className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/40 transition-all duration-300"
              >
                <Twitter className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/40 transition-all duration-300"
              >
                <Linkedin className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              </a>
            </div>

            <div className="border-t border-white/10 dark:border-gray-700/20 pt-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2024 UniMatch. Made with ❤️ for students worldwide.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  )
}

export default USAUniversityFinder

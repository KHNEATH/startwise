import React from 'react';

const aboutSections = [
  {
    title: 'About Us',
    text: "StartWise's company and culture are a lot like our product. They're crafted, not cobbled, for a delightful experience.",
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    imageRight: true,
  },
  {
    title: 'Our Mission: Helping Millions of Organizations Grow Better',
    text: `We believe not just in growing bigger, but in growing better. And growing better means aligning the success of your own business with the success of your customers. Win-win!`,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    imageRight: false,
  },
  {
    title: 'Our Story',
    text: `In 2025, StartWise was founded to help companies shift to grow better with inbound talent and smart job matching. We expanded beyond job boards into a crafted, not cobbled suite of products that create the frictionless candidate experience that employers expect today. Expertly led by our team, StartWise uses its platform built on an AI-powered Smart CRM to help millions of scaling organizations grow better.`,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    imageRight: true,
  },
];

const stats = [
  { label: 'Global Offices', value: '12', icon: '🌍', link: '#' },
  { label: 'Employees', value: '7,600+', icon: '👩‍💼', link: '#' },
  { label: 'Customers', value: '205,000+', icon: '🤝', link: '#' },
];

export default function AboutUs() {
  return (
    <div className="bg-gray-50 min-h-screen pt-28">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-12 pb-16">
        {aboutSections.map((section, idx) => (
          <section
            key={section.title}
            className={`flex flex-col md:flex-row ${section.imageRight ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 mb-20`}
          >
            <div className="md:w-1/2 w-full">
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-4">{section.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{section.text}</p>
            </div>
            <div className="md:w-1/2 w-full flex justify-center">
              <img
                src={section.image}
                alt={section.title}
                className="rounded-xl shadow-lg object-cover w-full max-w-md h-56 md:h-64"
              />
            </div>
          </section>
        ))}

        {/* Stats Section */}
        <section className="bg-blue-50 rounded-2xl shadow p-10 flex flex-col items-center mb-12">
          <h3 className="text-2xl font-extrabold text-blue-700 mb-8 tracking-tight">StartWise By the Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {stats.map(stat => (
              <a key={stat.label} href={stat.link} className="flex flex-col items-center bg-white rounded-xl shadow p-6 hover:shadow-lg transition border border-gray-100">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-extrabold text-blue-800">{stat.value}</div>
                <div className="text-blue-700 font-semibold">{stat.label}</div>
                <span className="mt-2 text-blue-600 text-sm font-semibold hover:underline">Learn more</span>
              </a>
            ))}
          </div>
        </section>

        {/* Awards Section */}
        <section className="flex flex-wrap justify-center gap-4 mt-8">
          {[2024,2023,2022,2021,2020,2019].map(year => (
            <div key={year} className="flex flex-col items-center">
              <img src={`https://cdn-icons-png.flaticon.com/512/1828/1828884.png`} alt="Award" className="w-10 h-10 mb-1" />
              <span className="text-xs text-gray-500 font-semibold">Best Product {year}</span>
            </div>
          ))}
        </section>

        <div className="text-center text-blue-700 text-base mt-8 font-semibold">
          Voted #1 in 318 categories &mdash; <button className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer">Learn more</button>
        </div>
      </main>
    </div>
  );
}

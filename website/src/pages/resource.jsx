import React, { useState } from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources = {
    courses: [
      {
        title: "Y Combinator Startup School",
        description: "Free online program teaching startup fundamentals",
        link: "https://www.startupschool.org/",
        type: "course"
      },
      {
        title: "MIT OpenCourseWare - Entrepreneurship",
        description: "Free entrepreneurship courses from MIT",
        link: "https://ocw.mit.edu/courses/entrepreneurship/",
        type: "course"
      }
    ],
    books: [
      {
        title: "The Lean Startup",
        description: "By Eric Ries - How to build a successful startup",
        link: "https://theleanstartup.com/",
        type: "book"
      },
      {
        title: "Zero to One",
        description: "By Peter Thiel - Notes on startups and innovation",
        link: "https://zerotoonebook.com/",
        type: "book"
      }
    ],
    blogs: [
      {
        title: "Paul Graham's Essays",
        description: "Insights from Y Combinator co-founder",
        link: "http://www.paulgraham.com/articles.html",
        type: "blog"
      },
      {
        title: "First Round Review",
        description: "In-depth startup advice and case studies",
        link: "https://review.firstround.com/",
        type: "blog"
      }
    ],
    tools: [
      {
        title: "Product Hunt",
        description: "Discover new startup tools and products",
        link: "https://www.producthunt.com/",
        type: "tool"
      },
      {
        title: "Startup Stash",
        description: "Curated directory of startup resources",
        link: "https://startupstash.com/",
        type: "tool"
      }
    ]
  };

  const filterResources = () => {
    if (selectedCategory === 'all') {
      return Object.values(resources).flat();
    }
    return resources[selectedCategory] || [];
  };

  return (
    <div className="hero">
      <header>
        <div className="logo">SageSeed</div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/learn">Learn</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>
      </header>

      <div className="learn-content" style={styles.learnContent}>
        <h1 style={styles.title}>Startup Learning Hub</h1>
        <p style={styles.subtitle}>Curated resources to help you succeed</p>

        <div style={styles.categories}>
          <button 
            onClick={() => setSelectedCategory('all')}
            style={{
              ...styles.categoryButton,
              backgroundColor: selectedCategory === 'all' ? '#B2AC88' : 'white',
              color: selectedCategory === 'all' ? 'white' : '#B2AC88'
            }}
          >
            All Resources
          </button>
          {Object.keys(resources).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                ...styles.categoryButton,
                backgroundColor: selectedCategory === category ? '#B2AC88' : 'white',
                color: selectedCategory === category ? 'white' : '#B2AC88'
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.resourcesGrid}>
          {filterResources().map((resource, index) => (
            <div key={index} style={styles.resourceCard}>
              <h3 style={styles.resourceTitle}>{resource.title}</h3>
              <p style={styles.resourceDescription}>{resource.description}</p>
              <a 
                href={resource.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.resourceLink}
              >
                Learn More →
              </a>
              <span style={styles.resourceType}>{resource.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  learnContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '100px 20px',
    width: '100%'
  },
  title: {
    fontSize: '3em',
    color: '#B2AC88',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '1.2em',
    color: '#666',
    marginBottom: '40px'
  },
  categories: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  categoryButton: {
    padding: '10px 20px',
    border: '2px solid #B2AC88',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 'bold'
  },
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    padding: '20px 0'
  },
  resourceCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  resourceTitle: {
    color: '#B2AC88',
    marginBottom: '10px',
    fontSize: '1.2em'
  },
  resourceDescription: {
    color: '#666',
    marginBottom: '20px',
    fontSize: '0.9em'
  },
  resourceLink: {
    color: '#B2AC88',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateX(5px)'
    }
  },
  resourceType: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '4px 8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    fontSize: '0.8em',
    color: '#666'
  }
};

export default Learn;
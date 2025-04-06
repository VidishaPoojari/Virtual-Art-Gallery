Virtual Art Gallery for Student Exhibitions

A responsive web-based platform that allows students to digitally showcase their artwork in an online gallery format. Users can upload, browse, and view various types of student-created visual art — such as paintings, digital illustrations, and photographs.

⸻

Live Demo

https://virtual-art-gallery-woad.vercel.app

⸻

Features

Artwork Upload & Management
	•	Students can upload artworks with a title and description
	•	Supports image preview and removal before uploading

Gallery Browsing
	•	View all uploaded artworks in a grid layout
	•	Search artworks by title or artist name
	•	Filter by category (Painting, Digital Art, Photography)

Commenting System (Mock Only)
	•	Users can view a comment section under artworks
	•	Currently uses mock data (real backend integration planned)

Responsive Design
	•	Fully mobile-friendly and responsive UI

Secure Authentication
	•	Firebase Authentication used for email/password login
	•	Passwords are encrypted and securely stored

⸻

Built With
	•	React
	•	Vite
	•	TypeScript
	•	Tailwind CSS
	•	shadcn/ui
	•	Firebase (Authentication)

⸻

System Overview
	•	Frontend: React + Vite (deployed on Vercel)
	•	Backend: No custom backend; logic handled on client-side
	•	Auth: Firebase Authentication
	•	Database: None (no real-time storage for comments/artwork yet)
	•	Storage: Handled temporarily via local state; planned integration with Firebase or MongoDB
	•	CI/CD: GitHub + Vercel (automatic build and deployment on every push to main)

⸻

CI/CD Pipeline
	•	Source code hosted on GitHub
	•	Connected to Vercel for automatic deployment
	•	GitHub Actions workflow runs npm run build
	•	No manual deployment steps required

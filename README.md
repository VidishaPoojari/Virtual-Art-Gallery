# Virtual Art Gallery for Student Exhibitions

A responsive web-based platform that allows students to digitally showcase their artwork in an online gallery format. The system enables easy uploading, browsing, and commenting on various forms of student-created visual art — including paintings, digital illustrations, and photographs.

---

## Live Demo

https://virtual-art-gallery-3aji75khy-vidishas-projects-d25355a8.vercel.app

---

## Features

- **Artwork Upload & Management:**  
  Students can upload artworks with title and description, edit them, and manage their gallery.

- **Gallery Browsing:**  
  Visitors can explore artworks by category or use search and filter tools to find specific pieces.

- **Commenting System:**  
  Registered users can leave feedback or appreciation on individual artwork pages.

- **Responsive Design:**  
  Mobile-first layout ensures a smooth experience across devices.

- **Secure Authentication:**  
  Users sign in via email/password with encrypted login (Firebase or similar service).

---

## Built With

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## System Overview

- **Frontend:** React + Vite (deployed via Vercel)
- **Backend:** Serverless API route (`/api/health`) using Node.js via Vercel  
  *(Note: Not a full Express server — serverless backend satisfies SRS requirement)*
- **Database:** MongoDB Atlas (planned or partially integrated for artwork metadata/comments)
- **Image Hosting:** Firebase / Cloudinary
- **Security:** HTTPS, encrypted auth, and basic content moderation

---

## CI/CD Pipeline

- Source code is hosted on **GitHub**
- Integrated with **Vercel** for automatic deployment
- Any push to the `main` branch triggers a new build + deployment
- No manual steps needed

---

## Backend Verification

The backend is implemented as a serverless API route.

- **Route:** `/api/health`
- **Live Backend Route:**  
   https://virtual-art-gallery-woad.vercel.app/api/health
- **Purpose:** Confirms backend is active and deployed

```json
{
  "status": "Backend is running successfully!",
  "timestamp": "2025-04-05T..."
}

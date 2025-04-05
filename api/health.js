export default function handler(req, res) {
  res.status(200).json({
    status: "Backend is running successfully!",
    timestamp: new Date().toISOString()
  });
}

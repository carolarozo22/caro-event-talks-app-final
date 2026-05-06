const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Sample talk data
const talksData = [
    {
        id: 'talk-1',
        title: 'The Future of AI in Web Development',
        speakers: ['Dr. Anya Sharma'],
        category: ['AI', 'Web Development'],
        duration: 60, // minutes
        description: 'Exploring the latest advancements and practical applications of AI in modern web frameworks.'
    },
    {
        id: 'talk-2',
        title: 'Mastering React Hooks',
        speakers: ['Ben Carter'],
        category: ['Frontend', 'React'],
        duration: 60,
        description: 'A comprehensive guide to building efficient and scalable React applications using Hooks.'
    },
    {
        id: 'talk-3',
        title: 'Backend Scalability with Node.js',
        speakers: ['Carlos Rodriguez', 'Diana Lee'],
        category: ['Backend', 'Node.js', 'Scalability'],
        duration: 60,
        description: 'Strategies and best practices for developing high-performance and scalable Node.js microservices.'
    },
    {
        id: 'talk-4',
        title: 'Containerization with Docker & Kubernetes',
        speakers: ['Eve Chen'],
        category: ['DevOps', 'Containers'],
        duration: 60,
        description: 'Demystifying container orchestration for seamless deployment and management of applications.'
    },
    {
        id: 'talk-5',
        title: 'Effective Database Design',
        speakers: ['Frank White'],
        category: ['Databases', 'Design'],
        duration: 60,
        description: 'Principles and patterns for designing robust and efficient database schemas.'
    },
    {
        id: 'talk-6',
        title: 'Cybersecurity Best Practices for Developers',
        speakers: ['Grace Ho'],
        category: ['Security', 'Best Practices'],
        duration: 60,
        description: 'Essential security measures and defensive programming techniques for every developer.'
    },
];

// Function to calculate the schedule based on talksData
function getSchedule() {
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    const schedule = [];
    let talkIndex = 0;

    for (let i = 0; i < 6; i++) { // 6 talks
        // Add lunch break after the 3rd talk
        if (talkIndex === 3) {
            schedule.push({
                type: 'break',
                title: 'Lunch Break',
                startTime: new Date(currentTime),
                endTime: new Date(currentTime.getTime() + 60 * 60 * 1000) // 1 hour lunch
            });
            currentTime.setMinutes(currentTime.getMinutes() + 60); // Advance time by 1 hour
        }

        const talk = { ...talksData[talkIndex] };
        talk.type = 'talk';
        talk.startTime = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + talk.duration);
        talk.endTime = new Date(currentTime);
        schedule.push(talk);

        talkIndex++;

        // Add transition after each talk except the last one
        if (talkIndex < talksData.length) {
            schedule.push({
                type: 'transition',
                title: 'Transition',
                startTime: new Date(currentTime),
                endTime: new Date(currentTime.getTime() + 10 * 60 * 1000) // 10 min transition
            });
            currentTime.setMinutes(currentTime.getMinutes() + 10);
        }
    }
    return schedule;
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for talks data
app.get('/api/talks', (req, res) => {
    res.json(getSchedule());
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
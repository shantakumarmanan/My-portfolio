document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Dynamic Interactive Canvas Particles
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 25), 45);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - dist / 1000})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    // ==========================================
    // 2. Vibrant Theme Switcher & Persistence
    // ==========================================
    const themeDots = document.querySelectorAll('.theme-dot');
    const savedTheme = localStorage.getItem('manan-theme') || 'cyan';
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeDots.forEach(dot => {
            if (dot.getAttribute('data-set-theme') === theme) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        localStorage.setItem('manan-theme', theme);
    }

    setTheme(savedTheme);

    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const theme = dot.getAttribute('data-set-theme');
            setTheme(theme);
        });
    });

    // ==========================================
    // 3. Mobile Navigation & Active Links
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.className = 'ph ph-x';
                } else {
                    icon.className = 'ph ph-list';
                }
            }
        });
    }

    // Highlighting active page link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navAnchors = document.querySelectorAll('.nav-links a');
    navAnchors.forEach(a => {
        const href = a.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            a.classList.add('active-link');
        }
    });

    // ==========================================
    // 4. Animated Stats Number Counters
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function countUpStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target') || '0', 10);
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            let count = 0;
            const increment = Math.ceil(target / 40);

            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    count = target;
                    clearInterval(timer);
                }
                stat.textContent = `${prefix}${count}${suffix}`;
            }, 30);
        });
    }

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    countUpStats();
                    animatedStats = true;
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 5. Skill Progress Bars Animation
    // ==========================================
    const progressFills = document.querySelectorAll('.skill-progress-fill');
    if (progressFills.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-progress') || '0%';
                    entry.target.style.width = width;
                }
            });
        }, { threshold: 0.2 });

        progressFills.forEach(fill => skillObserver.observe(fill));
    }

    // ==========================================
    // 6. Skill & Project Category Filtering
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterableCards = document.querySelectorAll('.project-card, .skill-bar-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            filterableCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
                    card.style.display = 'flex';
                    if (card.classList.contains('skill-bar-item')) card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 7. Interactive Code Showcase Switcher
    // ==========================================
    const codeTabs = document.querySelectorAll('.code-tab');
    const codeOutput = document.getElementById('codeDisplay');

    const codeSnippets = {
        cpp: `// C++ DSA Solution: Efficient Graph BFS & Shortest Path
#include <iostream>
#include <vector>
#include <queue>

using namespace std;

class Graph {
    int V;
    vector<vector<int>> adj;
public:
    Graph(int v) : V(v), adj(v) {}
    
    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    
    void shortestPathBFS(int startNode) {
        vector<int> dist(V, -1);
        queue<int> q;
        
        dist[startNode] = 0;
        q.push(startNode);
        
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            
            for (int neighbor : adj[u]) {
                if (dist[neighbor] == -1) {
                    dist[neighbor] = dist[u] + 1;
                    q.push(neighbor);
                }
            }
        }
    }
};`,
        react: `// React Custom Hook: Dynamic Real-time Data Fetcher
import { useState, useEffect } from 'react';

export function useLiveMetrics(endpoint, refreshInterval = 5000) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const res = await fetch(endpoint);
                const result = await res.json();
                if (isMounted) setData(result);
            } catch (err) {
                console.error("API error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, refreshInterval);
        return () => { isMounted = false; clearInterval(interval); };
    }, [endpoint, refreshInterval]);

    return { data, loading };
}`,
        node: `// Node.js REST API Controller with Auth & Caching
const express = require('express');
const router = express.Router();

router.get('/api/v1/projects', async (req, res) => {
    try {
        const projects = [
            { id: 1, name: 'Bus Booking System', lang: 'C++' },
            { id: 2, name: 'Ballistics Tool', lang: 'PHP/JS' }
        ];
        return res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;`
    };

    if (codeTabs.length > 0 && codeOutput) {
        codeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                codeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const lang = tab.getAttribute('data-lang');
                if (codeSnippets[lang]) {
                    codeOutput.textContent = codeSnippets[lang];
                }
            });
        });
    }

    // ==========================================
    // 8. FAQ Accordion Toggle
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains('active');

            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================
    // 9. Interactive Modal System
    // ==========================================
    const modalOverlay = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');

    window.openModal = function(title, description, tags = []) {
        if (!modalOverlay) return;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalDesc').textContent = description;

        const tagsContainer = document.getElementById('modalTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = tags.map(t => `<span class="project-tag">${t}</span>`).join('');
        }

        modalOverlay.classList.add('active');
    };

    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 10. Contact Form Simulation
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                if (formMessage) {
                    formMessage.textContent = '✨ Message sent! Shanta Kumar Manan will get back to you shortly.';
                    formMessage.style.color = 'var(--acc-emerald)';
                    setTimeout(() => {
                        formMessage.textContent = '';
                    }, 5000);
                }
            }, 1200);
        });
    }

    // ==========================================
    // 11. Intersection Observer for Scroll Fade
    // ==========================================
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -40px 0px" };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));
});

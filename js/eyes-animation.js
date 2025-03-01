 feather.replace();

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        function updateActiveLink() {
            const currentScroll = window.scrollY + window.innerHeight / 2;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (currentScroll >= sectionTop && currentScroll <= sectionBottom) {
                    const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
                    navLinks.forEach(link => link.classList.remove('text-blue-400'));
                    if (correspondingLink) {
                        correspondingLink.classList.add('text-blue-400');
                    }
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink);
        
        let mousePosition = { x: 0, y: 0 };
        let eyesContainers = [
            document.getElementById('skills-eyes-container'),
            document.getElementById('portfolio-eyes-container')
        ];
        let allEyes = [];
        
        const techColors = [
            { main: '#00FFFF', dark: '#00AAAA' },
            { main: '#0077FF', dark: '#0055AA' },
            { main: '#00FF77', dark: '#00AA55' },
            { main: '#9933FF', dark: '#6622AA' },
            { main: '#FF3366', dark: '#AA2244' },
            { main: '#FFCC00', dark: '#AA8800' }
        ];
        
        function generateRandomBinary(length) {
            return Array.from({ length }, () => Math.round(Math.random())).join('');
        }
        
        function corruptBinary(binary) {
            const glitchChars = ['1', '0', 'x', '!', '?', '#', '%', '&', '@', '$', '*', '{', '}', '<', '>', '|', '\\', '/', '=', '+', '-'];
            return binary.split('').map(char => {
                return Math.random() < 0.4 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char;
            }).join('');
        }
        
        function createEye(id, position, size, color, containerId) {
            const eye = document.createElement('div');
            eye.id = id;
            eye.className = 'tech-eye';
            eye.style.width = `${size}px`;
            eye.style.height = `${size}px`;
            eye.style[position.side] = '2%';
            eye.style.top = position.top;
            
            const dataStream = generateRandomBinary(20);
            
            eye.innerHTML = `
                <div class="eye-outline" style="box-shadow: 0 0 5px ${color.main}; border: 2px solid ${color.main};">
                    <div class="sclera">
                        <div class="scan-line" style="color: ${color.main}; top: ${Math.random() * 100}%;"></div>
                        <div class="eyelid-top" style="border-bottom: 1px solid ${color.main};"></div>
                        <div class="eyelid-bottom" style="border-top: 1px solid ${color.main};"></div>
                        <div class="iris" style="background: radial-gradient(circle, ${color.main} 0%, ${color.dark} 70%, #000000 100%);">
                            <div class="iris-pattern"></div>
                            <div class="iris-circuit" style="animation: rotate-${id} 8s linear infinite;"></div>
                            <div class="pupil" style="box-shadow: inset 0 0 10px ${color.main}, 0 0 15px ${color.main};">
                                <div class="pupil-reflection"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    @keyframes rotate-${id} {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                </style>
            `;
            
            return {
                element: eye,
                id,
                containerId,
                position,
                color,
                dataStream,
                isGlitching: false,
                glitchRate: Math.random() * 2,
                glitchSeverity: Math.random() * 0.9 + 0.6
            };
        }
        
        function initEyes() {
            eyesContainers.forEach((container, containerIndex) => {
                if (!container) return;
                
                const eyeCount = 6;
                const containerPrefix = containerIndex === 0 ? 'skills' : 'portfolio';
                const containerHeight = container.parentElement.offsetHeight;
                
                for (let i = 0; i < eyeCount/2; i++) {
                    const id = `${containerPrefix}-left-eye-${i}`;
                    const position = { 
                        side: 'left', 
                        top: `${15 + (i * 30)}%` 
                    };
                    const size = Math.random() * 20 + 60;
                    const color = techColors[Math.floor(Math.random() * techColors.length)];
                    
                    const eye = createEye(id, position, size, color, container.id);
                    container.appendChild(eye.element);
                    allEyes.push(eye);
                }
                
                for (let i = 0; i < eyeCount/2; i++) {
                    const id = `${containerPrefix}-right-eye-${i}`;
                    const position = { 
                        side: 'right', 
                        top: `${15 + (i * 30)}%` 
                    };
                    const size = Math.random() * 20 + 60;
                    const color = techColors[Math.floor(Math.random() * techColors.length)];
                    
                    const eye = createEye(id, position, size, color, container.id);
                    container.appendChild(eye.element);
                    allEyes.push(eye);
                }
            });
        }
        
        function trackMouse() {
            document.addEventListener('mousemove', (e) => {
                mousePosition = {
                    x: e.clientX,
                    y: e.clientY
                };
            });
        }
        
        function updateEyes() {
            allEyes.forEach(eye => {
                const eyeElement = document.getElementById(eye.id);
                if (!eyeElement) return;
                
                const eyeRect = eyeElement.getBoundingClientRect();
                
                const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                const eyeCenterY = eyeRect.top + eyeRect.height / 2;
                
                const angle = Math.atan2(mousePosition.y - eyeCenterY, mousePosition.x - eyeCenterX);
                
                const distance = Math.min(
                    Math.hypot(mousePosition.x - eyeCenterX, mousePosition.y - eyeCenterY),
                    eyeRect.width * 0.4
                );
                
                const pupilX = Math.cos(angle) * distance * 0.5;
                const pupilY = Math.sin(angle) * distance * 0.5;
                
                const iris = eyeElement.querySelector('.iris');
                const pupil = eyeElement.querySelector('.pupil');
                
                if (iris && pupil) {
                    const jitterX = eye.isGlitching ? (Math.random() - 0.5) * 20 : 0;
                    const jitterY = eye.isGlitching ? (Math.random() - 0.5) * 20 : 0;
                    
                    iris.style.transform = `translate(${pupilX * 0.7 + jitterX}px, ${pupilY * 0.7 + jitterY}px)`;
                    pupil.style.transform = `translate(${pupilX + jitterX * 1.5}px, ${pupilY + jitterY * 1.5}px)`;
                }
            });
            
            requestAnimationFrame(updateEyes);
        }
        
        function setupBlinking() {
            allEyes.forEach(eye => {
                const blinkInterval = 2000 + Math.random() * 4000;
                
                setInterval(() => {
                    const eyeElement = document.getElementById(eye.id);
                    if (!eyeElement) return;
                    
                    const topEyelid = eyeElement.querySelector('.eyelid-top');
                    const bottomEyelid = eyeElement.querySelector('.eyelid-bottom');
                    if (!topEyelid || !bottomEyelid) return;
                    
                    topEyelid.style.transform = 'translateY(0)';
                    bottomEyelid.style.transform = 'translateY(0)';
                    
                    const randomDelay = eye.isGlitching ? 
                        Math.random() > 0.5 ? 50 : 250 : 
                        100 + Math.random() * 80;
                        
                    setTimeout(() => {
                        topEyelid.style.transform = 'translateY(-100%)';
                        bottomEyelid.style.transform = 'translateY(100%)';
                    }, randomDelay);
                    
                    if (eye.isGlitching && Math.random() > 0.6) {
                        setTimeout(() => {
                            topEyelid.style.transform = 'translateY(0)';
                            bottomEyelid.style.transform = 'translateY(0)';
                            
                            setTimeout(() => {
                                topEyelid.style.transform = 'translateY(-100%)';
                                bottomEyelid.style.transform = 'translateY(100%)';
                            }, 50);
                        }, randomDelay + 100);
                    }
                }, blinkInterval);
                
                if (Math.random() > 0.7) {
                    setInterval(() => {
                        if (!eye.isGlitching && Math.random() > 0.7) {
                            const eyeElement = document.getElementById(eye.id);
                            if (!eyeElement) return;
                            
                            const topEyelid = eyeElement.querySelector('.eyelid-top');
                            const bottomEyelid = eyeElement.querySelector('.eyelid-bottom');
                            
                            const twitchAmount = Math.random() * 20;
                            topEyelid.style.transform = `translateY(-${100 - twitchAmount}%)`;
                            
                            setTimeout(() => {
                                topEyelid.style.transform = 'translateY(-100%)';
                            }, 50);
                        }
                    }, 1000);
                }
            });
        }
        
        function setupGlitching() {
            allEyes.forEach(eye => {
                const glitchCheckInterval = 1000 / eye.glitchRate;
                
                setInterval(() => {
                    if (Math.random() < eye.glitchSeverity * 0.5) {
                        eye.isGlitching = true;
                        
                        const eyeElement = document.getElementById(eye.id);
                        if (!eyeElement) return;
                        
                        const outline = eyeElement.querySelector('.eye-outline');
                        
                        const glitchTransformX = (Math.random() - 0.5) * 20;
                        const glitchTransformY = (Math.random() - 0.5) * 20;
                        const glitchRotate = Math.random() > 0.7 ? `rotate(${(Math.random() - 0.5) * 20}deg)` : '';
                        const glitchScale = Math.random() > 0.8 ? `scale(${0.8 + Math.random() * 0.4})` : '';
                        
                        eyeElement.style.transform = `translate(${glitchTransformX}px, ${glitchTransformY}px) ${glitchRotate} ${glitchScale}`;
                        eyeElement.style.filter = `contrast(${1 + Math.random()})) brightness(${1 + Math.random() * 0.5}) hue-rotate(${Math.random() * 30}deg)`;
                        
                        if (outline) {
                            outline.style.boxShadow = `0 0 ${8 + Math.random() * 12}px ${eye.color.main}, 0 0 ${12 + Math.random() * 8}px ${eye.color.main}`;
                            
                            if (Math.random() > 0.7) {
                                outline.style.borderRadius = `${40 + Math.random() * 20}%`;
                                setTimeout(() => {
                                    outline.style.borderRadius = '50%';
                                }, 150);
                            }
                        }
                        
                        const sclera = eyeElement.querySelector('.sclera');
                        if (sclera) {
                            const scanLine = sclera.querySelector('.scan-line');
                            if (scanLine) {
                                scanLine.style.opacity = '0.9';
                                scanLine.style.height = `${Math.random() * 5 + 1}px`;
                                
                                if (Math.random() > 0.6) {
                                    scanLine.style.transform = `scaleX(${0.5 + Math.random() * 0.5}) translateY(${(Math.random() - 0.5) * 10}px)`;
                                    setTimeout(() => {
                                        scanLine.style.transform = '';
                                    }, 200);
                                }
                            }
                            
                            for (let i = 0; i < Math.floor(Math.random() * 6) + 3; i++) {
                                const glitchLine = document.createElement('div');
                                glitchLine.className = 'scan-line';
                                glitchLine.style.opacity = Math.random() * 0.5 + 0.4;
                                glitchLine.style.color = Math.random() > 0.3 ? eye.color.main : techColors[Math.floor(Math.random() * techColors.length)].main;
                                glitchLine.style.width = `${Math.random() * 100}%`;
                                glitchLine.style.left = `${Math.random() * 100}%`;
                                glitchLine.style.top = `${Math.random() * 100}%`;
                                glitchLine.style.height = `${Math.random() * 3 + 1}px`;
                                glitchLine.style.transform = `scaleY(${Math.random() * 3 + 0.5}) rotate(${Math.random() * 10}deg)`;
                                
                                sclera.appendChild(glitchLine);
                                
                                setTimeout(() => {
                                    if (sclera.contains(glitchLine)) {
                                        sclera.removeChild(glitchLine);
                                    }
                                }, Math.random() * 300 + 100);
                            }
                            
                            const iris = eyeElement.querySelector('.iris');
                            if (iris && Math.random() > 0.7) {
                                const originalColor = iris.style.background;
                                iris.style.background = `radial-gradient(circle, ${techColors[Math.floor(Math.random() * techColors.length)].main} 0%, ${eye.color.dark} 70%, #000000 100%)`;
                                
                                setTimeout(() => {
                                    iris.style.background = originalColor;
                                }, 100);
                            }
                        }
                        
                        setTimeout(() => {
                            eye.isGlitching = false;
                            
                            eyeElement.style.transform = '';
                            eyeElement.style.filter = '';
                            
                            if (outline) {
                                outline.style.boxShadow = `0 0 5px ${eye.color.main}`;
                                outline.style.borderRadius = '50%';
                            }
                            
                            const sclera = eyeElement.querySelector('.sclera');
                            if (sclera) {
                                const scanLine = sclera.querySelector('.scan-line');
                                if (scanLine) {
                                    scanLine.style.opacity = '0.3';
                                    scanLine.style.height = '1px';
                                    scanLine.style.transform = '';
                                }
                                
                                const topEyelid = sclera.querySelector('.eyelid-top');
                                const bottomEyelid = sclera.querySelector('.eyelid-bottom');
                                if (topEyelid) topEyelid.style.transform = 'translateY(-100%)';
                                if (bottomEyelid) bottomEyelid.style.transform = 'translateY(100%)';
                            }
                        }, Math.random() * 400 + 100);
                    }
                }, glitchCheckInterval);
                
                if (Math.random() > 0.5) {
                    setInterval(() => {
                        if (!eye.isGlitching && Math.random() > 0.8) {
                            const eyeElement = document.getElementById(eye.id);
                            if (!eyeElement) return;
                            
                            const quickGlitchDuration = 50 + Math.random() * 100;
                            
                            eyeElement.style.transform = `translateX(${(Math.random() - 0.5) * 8}px)`;
                            
                            setTimeout(() => {
                                eyeElement.style.transform = '';
                            }, quickGlitchDuration);
                        }
                    }, 2000);
                }
            });
        }
        
        function updateScanLines() {
            allEyes.forEach(eye => {
                const eyeElement = document.getElementById(eye.id);
                if (!eyeElement) return;
                
                const scanLine = eyeElement.querySelector('.scan-line');
                if (!scanLine || eye.isGlitching) return;
                
                let currentTop = parseFloat(scanLine.style.top) || 0;
                currentTop = (currentTop + (Math.random() > 0.9 ? Math.random() * 5 : 0.5)) % 100;
                scanLine.style.top = `${currentTop}%`;
            });
            
            setTimeout(updateScanLines, 30);
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            initEyes();
            trackMouse();
            updateEyes();
            setupBlinking();
            setupGlitching();
            updateScanLines();
        });
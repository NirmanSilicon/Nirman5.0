// Dashboard functionality
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.quizAnswers = {};
        this.API_BASE = 'http://localhost:5000/api';
        
        this.initializeDashboard();
    }
    
    initializeDashboard() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadUserData();
    }
    
    checkAuth() {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            window.location.href = '../index.html';
            return;
        }
        
        try {
            this.currentUser = JSON.parse(userData);
            this.updateUIForUser();
        } catch (error) {
            console.error('Error parsing user data:', error);
            window.location.href = '../index.html';
        }
    }
    
    updateUIForUser() {
        // Update welcome message
        const welcomeElement = document.querySelector('.dashboard-welcome h1');
        if (welcomeElement) {
            welcomeElement.textContent = `Welcome back, ${this.currentUser.name}!`;
        }

        // Update auth buttons in header
        this.updateHeaderAuth();
    }

    updateHeaderAuth() {
        const authButtonsContainer = document.querySelector('.auth-buttons');
        if (authButtonsContainer && this.currentUser) {
            authButtonsContainer.innerHTML = `
                <div class="user-avatar" id="userAvatar" title="${this.currentUser.name}">
                    ${this.currentUser.name.charAt(0).toUpperCase()}
                </div>
            `;
            
            // Add user avatar event listener
            const userAvatar = document.getElementById('userAvatar');
            if (userAvatar) {
                userAvatar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleUserDropdown();
                });
            }
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Quick actions - FIXED: Added proper event listeners
        const uploadMaterialBtn = document.getElementById('uploadMaterialBtn');
        const generateQuizBtn = document.getElementById('generateQuizBtn');
        const viewQuizzesBtn = document.getElementById('viewQuizzesBtn');
        const analyticsBtn = document.getElementById('analyticsBtn');
        
        if (uploadMaterialBtn) {
            uploadMaterialBtn.addEventListener('click', () => this.showUploadModal());
            console.log('Upload material button listener added');
        }
        
        if (generateQuizBtn) {
            generateQuizBtn.addEventListener('click', () => this.showGenerateQuizModal());
            console.log('Generate quiz button listener added');
        }
        
        if (viewQuizzesBtn) {
            viewQuizzesBtn.addEventListener('click', () => {
                document.getElementById('quizzes').scrollIntoView({ behavior: 'smooth' });
            });
            console.log('View quizzes button listener added');
        }
        
        if (analyticsBtn) {
            analyticsBtn.addEventListener('click', () => {
                document.getElementById('analytics').scrollIntoView({ behavior: 'smooth' });
            });
            console.log('Analytics button listener added');
        }
        
        // Empty state buttons
        const uploadFirstMaterial = document.getElementById('uploadFirstMaterial');
        const generateFirstQuiz = document.getElementById('generateFirstQuiz');
        
        if (uploadFirstMaterial) {
            uploadFirstMaterial.addEventListener('click', () => this.showUploadModal());
        }
        
        if (generateFirstQuiz) {
            generateFirstQuiz.addEventListener('click', () => this.showGenerateQuizModal());
        }
        
        // Form submissions
        const uploadForm = document.getElementById('uploadForm');
        const generateQuizForm = document.getElementById('generateQuizForm');
        
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleUpload(e));
        }
        
        if (generateQuizForm) {
            generateQuizForm.addEventListener('submit', (e) => this.handleGenerateQuiz(e));
        }
        
        // File upload
        const fileInput = document.getElementById('materialFile');
        const fileUploadArea = document.getElementById('fileUploadArea');
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        if (fileUploadArea) {
            fileUploadArea.addEventListener('click', () => fileInput?.click());
            fileUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            fileUploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
        }
        
        // Quiz navigation
        const prevQuestion = document.getElementById('prevQuestion');
        const nextQuestion = document.getElementById('nextQuestion');
        const submitQuiz = document.getElementById('submitQuiz');
        
        if (prevQuestion) {
            prevQuestion.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextQuestion) {
            nextQuestion.addEventListener('click', () => this.nextQuestion());
        }
        
        if (submitQuiz) {
            submitQuiz.addEventListener('click', () => this.submitQuiz());
        }
        
        // Results actions
        const reviewQuiz = document.getElementById('reviewQuiz');
        const newQuiz = document.getElementById('newQuiz');
        
        if (reviewQuiz) {
            reviewQuiz.addEventListener('click', () => this.reviewQuiz());
        }
        
        if (newQuiz) {
            newQuiz.addEventListener('click', () => this.newQuiz());
        }
        
        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Mobile menu
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenu && navLinks) {
            mobileMenu.addEventListener('click', () => {
                const isVisible = navLinks.style.display === 'flex';
                navLinks.style.display = isVisible ? 'none' : 'flex';
            });
        }

        console.log('All event listeners setup complete');
    }
    
    async loadUserData() {
        await this.loadMaterials();
        await this.loadQuizzes();
    }
    
    async loadMaterials() {
        try {
            // For now, we'll show sample materials since upload is not fully implemented
            this.showSampleMaterials();
            
        } catch (error) {
            console.error('Error loading materials:', error);
            this.showSampleMaterials();
        }
    }
    
    showSampleMaterials() {
        const materialsGrid = document.getElementById('materialsGrid');
        if (!materialsGrid) return;
        
        const sampleMaterials = [
            {
                id: 1,
                title: 'Machine Learning Basics',
                subject: 'Computer Science',
                fileType: 'pdf',
                uploadDate: '2024-01-15'
            },
            {
                id: 2,
                title: 'Physics Quantum Mechanics',
                subject: 'Physics',
                fileType: 'doc',
                uploadDate: '2024-01-10'
            }
        ];
        
        if (sampleMaterials.length === 0) {
            materialsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>No study materials yet</h3>
                    <p>Upload your first study material to get started!</p>
                    <button class="btn btn-primary" id="uploadFirstMaterial">Upload Material</button>
                </div>
            `;
            return;
        }
        
        materialsGrid.innerHTML = sampleMaterials.map(material => `
            <div class="material-card">
                <div class="material-icon">
                    <i class="fas fa-file-${material.fileType === 'pdf' ? 'pdf' : 'word'}"></i>
                </div>
                <div class="material-info">
                    <h3>${material.title}</h3>
                    <p class="material-subject">${material.subject}</p>
                    <p class="material-date">Uploaded: ${material.uploadDate}</p>
                </div>
                <div class="material-actions">
                    <button class="btn-action generate-from-material" title="Generate Quiz" data-material-id="${material.id}">
                        <i class="fas fa-robot"></i>
                    </button>
                    <button class="btn-action" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to generate buttons
        document.querySelectorAll('.generate-from-material').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const materialId = e.currentTarget.dataset.materialId;
                this.showGenerateQuizModal(materialId);
            });
        });
    }
    
    async loadQuizzes() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/quiz/my-quizzes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.displayQuizzes(result.quizzes);
                } else {
                    this.displayQuizzes([]);
                }
            } else {
                this.displayQuizzes([]);
            }
            
        } catch (error) {
            console.error('Error loading quizzes:', error);
            this.displayQuizzes([]);
        }
    }
    
    displayQuizzes(quizzes) {
        const quizzesGrid = document.getElementById('quizzesGrid');
        if (!quizzesGrid) return;
        
        if (!quizzes || quizzes.length === 0) {
            quizzesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-question-circle"></i>
                    <h3>No quizzes yet</h3>
                    <p>Generate your first quiz from your study materials!</p>
                    <button class="btn btn-primary" id="generateFirstQuiz">Generate Quiz</button>
                </div>
            `;
            return;
        }
        
        quizzesGrid.innerHTML = quizzes.map(quiz => `
            <div class="quiz-card" data-quiz-id="${quiz.id}">
                <div class="quiz-header">
                    <h3>${quiz.title}</h3>
                    <span class="quiz-badge ${quiz.difficulty}">${quiz.difficulty}</span>
                </div>
                <div class="quiz-info">
                    <p><i class="fas fa-question"></i> ${quiz.totalQuestions} questions</p>
                    <p><i class="fas fa-clock"></i> ${quiz.timeLimit} minutes</p>
                    <p><i class="fas fa-tasks"></i> ${quiz.quizType.replace('_', ' ')}</p>
                </div>
                <div class="quiz-status">
                    ${quiz.isCompleted ? 
                        `<div class="score">Score: ${quiz.score}/${quiz.maxScore}</div>` :
                        `<button class="btn btn-primary btn-small start-quiz">Start Quiz</button>`
                    }
                </div>
            </div>
        `).join('');
        
        // Add event listeners to start quiz buttons
        document.querySelectorAll('.start-quiz').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const quizCard = e.target.closest('.quiz-card');
                const quizId = quizCard.dataset.quizId;
                this.startQuiz(quizId);
            });
        });
    }
    
    showUploadModal() {
        console.log('Opening upload modal...');
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.style.display = 'block';
            console.log('Upload modal opened');
        }
    }
    
    showGenerateQuizModal(materialId = null) {
        console.log('Opening generate quiz modal...');
        const modal = document.getElementById('generateQuizModal');
        if (modal) {
            modal.style.display = 'block';
            
            // Pre-select material if provided
            if (materialId) {
                const materialSelect = document.getElementById('quizMaterial');
                if (materialSelect) {
                    materialSelect.value = materialId;
                }
            }
            console.log('Generate quiz modal opened');
        }
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        this.updateFileDisplay(file);
    }
    
    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
    }
    
    handleFileDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const fileInput = document.getElementById('materialFile');
            fileInput.files = files;
            this.updateFileDisplay(files[0]);
        }
    }
    
    updateFileDisplay(file) {
        const fileName = document.getElementById('fileName');
        const fileUploadArea = document.getElementById('fileUploadArea');
        
        if (file) {
            fileName.textContent = `Selected: ${file.name}`;
            fileName.style.display = 'block';
            fileUploadArea.classList.add('file-selected');
        }
    }
    
    async handleUpload(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        submitBtn.disabled = true;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/quiz/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Material uploaded successfully!', 'success');
                this.closeAllModals();
                event.target.reset();
                document.getElementById('fileName').style.display = 'none';
                document.getElementById('fileUploadArea').classList.remove('file-selected');
                this.loadMaterials();
            } else {
                this.showNotification(result.message, 'error');
            }
            
        } catch (error) {
            this.showNotification('Upload failed. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async handleGenerateQuiz(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            materialId: formData.get('materialId') || null,
            quizType: formData.get('quizType'),
            difficulty: formData.get('difficulty'),
            numQuestions: parseInt(formData.get('numQuestions'))
        };
        
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        submitBtn.disabled = true;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/quiz/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Quiz generated successfully!', 'success');
                this.closeAllModals();
                this.currentQuiz = result.quiz;
                this.startQuiz(this.currentQuiz.id);
                this.loadQuizzes();
            } else {
                this.showNotification(result.message, 'error');
            }
            
        } catch (error) {
            this.showNotification('Quiz generation failed. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async startQuiz(quizId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/quiz/my-quizzes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const quiz = result.quizzes.find(q => q.id == quizId);
                    if (quiz) {
                        this.currentQuiz = quiz;
                        this.currentQuestionIndex = 0;
                        this.quizAnswers = {};
                        this.showQuizInterface();
                    }
                }
            }
        } catch (error) {
            this.showNotification('Failed to load quiz', 'error');
        }
    }
    
    showQuizInterface() {
        const modal = document.getElementById('quizInterface');
        if (modal) {
            modal.style.display = 'block';
            this.displayCurrentQuestion();
        }
    }
    
    displayCurrentQuestion() {
        if (!this.currentQuiz || !this.currentQuiz.questions) return;
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionContainer = document.getElementById('questionContainer');
        const totalQuestions = this.currentQuiz.questions.length;
        
        // Update progress
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = totalQuestions;
        document.getElementById('progressFill').style.width = `${((this.currentQuestionIndex + 1) / totalQuestions) * 100}%`;
        document.getElementById('quizTitle').textContent = this.currentQuiz.title;
        
        // Display question based on type
        let questionHTML = '';
        
        switch (question.questionType) {
            case 'mcq':
                questionHTML = this.renderMCQ(question);
                break;
            case 'true_false':
                questionHTML = this.renderTrueFalse(question);
                break;
            case 'fill_blank':
                questionHTML = this.renderFillBlank(question);
                break;
        }
        
        if (questionContainer) {
            questionContainer.innerHTML = questionHTML;
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = this.currentQuestionIndex < totalQuestions - 1 ? 'block' : 'none';
        }
        
        if (submitBtn) {
            submitBtn.style.display = this.currentQuestionIndex === totalQuestions - 1 ? 'block' : 'none';
        }
        
        // Restore previous answer if exists
        this.restoreAnswer(question.id);
    }
    
    renderMCQ(question) {
        return `
            <div class="question" data-question-id="${question.id}">
                <h3>${question.questionText}</h3>
                <div class="options">
                    ${Object.entries(question.options).map(([key, value]) => `
                        <label class="option">
                            <input type="radio" name="answer" value="${key}">
                            <span class="option-text">${value}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderTrueFalse(question) {
        return `
            <div class="question" data-question-id="${question.id}">
                <h3>${question.questionText}</h3>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="answer" value="a">
                        <span class="option-text">True</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="answer" value="b">
                        <span class="option-text">False</span>
                    </label>
                </div>
            </div>
        `;
    }
    
    renderFillBlank(question) {
        return `
            <div class="question" data-question-id="${question.id}">
                <h3>${question.questionText}</h3>
                <div class="fill-blank">
                    <input type="text" id="fillAnswer" placeholder="Type your answer here...">
                </div>
            </div>
        `;
    }
    
    restoreAnswer(questionId) {
        const savedAnswer = this.quizAnswers[questionId];
        if (savedAnswer) {
            if (this.currentQuiz.questions[this.currentQuestionIndex].questionType === 'fill_blank') {
                const fillInput = document.getElementById('fillAnswer');
                if (fillInput) fillInput.value = savedAnswer;
            } else {
                const radio = document.querySelector(`input[value="${savedAnswer}"]`);
                if (radio) radio.checked = true;
            }
        }
    }
    
    saveCurrentAnswer() {
        const questionId = this.currentQuiz.questions[this.currentQuestionIndex].id;
        let answer = '';
        
        if (this.currentQuiz.questions[this.currentQuestionIndex].questionType === 'fill_blank') {
            const fillInput = document.getElementById('fillAnswer');
            answer = fillInput ? fillInput.value.trim() : '';
        } else {
            const selected = document.querySelector('input[name="answer"]:checked');
            answer = selected ? selected.value : '';
        }
        
        if (answer) {
            this.quizAnswers[questionId] = answer;
        }
    }
    
    previousQuestion() {
        this.saveCurrentAnswer();
        this.currentQuestionIndex--;
        this.displayCurrentQuestion();
    }
    
    nextQuestion() {
        this.saveCurrentAnswer();
        this.currentQuestionIndex++;
        this.displayCurrentQuestion();
    }
    
    async submitQuiz() {
        this.saveCurrentAnswer();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/quiz/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quizId: this.currentQuiz.id,
                    answers: this.quizAnswers
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showQuizResults(result.results);
            } else {
                this.showNotification('Quiz submission failed', 'error');
            }
            
        } catch (error) {
            this.showNotification('Submission failed. Please try again.', 'error');
        }
    }
    
    showQuizResults(results) {
        this.closeAllModals();
        
        const finalScore = document.getElementById('finalScore');
        const correctAnswers = document.getElementById('correctAnswers');
        const percentage = document.getElementById('percentage');
        const resultsModal = document.getElementById('quizResults');
        
        if (finalScore) finalScore.textContent = `${results.score}/${results.maxScore}`;
        if (correctAnswers) correctAnswers.textContent = results.correctAnswers;
        if (percentage) percentage.textContent = `${results.percentage}%`;
        if (resultsModal) resultsModal.style.display = 'block';
    }
    
    reviewQuiz() {
        this.showNotification('Review feature coming soon!', 'info');
    }
    
    newQuiz() {
        this.closeAllModals();
        this.showGenerateQuizModal();
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }
    
    showNotification(message, type = 'info') {
        // Use the same notification function from script.js
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                z-index: 3000;
                max-width: 300px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: translateX(400px);
                transition: transform 0.3s ease;
            `;
            
            if (type === 'success') {
                notification.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
            } else if (type === 'error') {
                notification.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
            } else {
                notification.style.background = 'linear-gradient(135deg, #4facfe, #00f2fe)';
            }
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initializing...');
    new Dashboard();
});
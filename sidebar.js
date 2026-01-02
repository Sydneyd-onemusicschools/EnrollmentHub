// Enrollment Hub - Sidebar Component
// This file automatically loads the sidebar on any page that includes it

(function() {
    // Sidebar HTML
    const sidebarHTML = `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-toggle" onclick="toggleSidebar()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </div>
            
            <div class="sidebar-header">
                <div class="sidebar-logo">Enrollment Hub</div>
                <div class="sidebar-subtitle">One Music Schools</div>
            </div>
            
            <nav class="sidebar-nav">
                <a href="dashboard.html" class="sidebar-link" data-page="dashboard">
                    <svg viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span class="sidebar-link-text">Dashboard</span>
                </a>
                
                <a href="team.html" class="sidebar-link" data-page="team">
                    <svg viewBox="0 0 24 24">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span class="sidebar-link-text">Team</span>
                </a>
                
                <a href="schedule.html" class="sidebar-link" data-page="schedule">
                    <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span class="sidebar-link-text">Schedule</span>
                </a>
                
                <a href="quotas.html" class="sidebar-link" data-page="quotas">
                    <svg viewBox="0 0 24 24">
                        <line x1="12" y1="20" x2="12" y2="10"></line>
                        <line x1="18" y1="20" x2="18" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                    <span class="sidebar-link-text">Quotas</span>
                </a>
                
                <a href="calculator.html" class="sidebar-link" data-page="calculator">
                    <svg viewBox="0 0 24 24">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        <line x1="8" y1="6" x2="16" y2="6"></line>
                        <line x1="8" y1="10" x2="16" y2="10"></line>
                        <line x1="8" y1="14" x2="16" y2="14"></line>
                        <line x1="8" y1="18" x2="12" y2="18"></line>
                    </svg>
                    <span class="sidebar-link-text">Calculator</span>
                </a>
                
                <a href="notes.html" class="sidebar-link" data-page="notes">
                    <svg viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span class="sidebar-link-text">Notes</span>
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <button class="logout-btn" onclick="logout()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="logout-btn-text">Logout</span>
                </button>
            </div>
        </div>

        <!-- Mobile Hamburger -->
        <div class="hamburger" onclick="toggleMobileSidebar()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </div>
    `;

    // Inject sidebar into the page
    function loadSidebar() {
        // Find the body or create a wrapper
        const body = document.body;
        
        // Insert sidebar at the beginning of body
        body.insertAdjacentHTML('afterbegin', sidebarHTML);
        
        // Set active page based on current URL
        setActivePage();
        
        // Load saved sidebar state
        loadSidebarState();
        
        // Add margin to main content
        adjustMainContent();
    }

    // Set active page based on current filename
    function setActivePage() {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
        const links = document.querySelectorAll('.sidebar-link');
        
        links.forEach(link => {
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Adjust main content margin for sidebar
    function adjustMainContent() {
        // Add global style that FORCES proper spacing
        const style = document.createElement('style');
        style.textContent = `
            body {
                padding: 0;
                margin: 0;
            }
            body > *:not(.sidebar):not(.hamburger) {
                margin-left: 280px !important;
                transition: margin-left 0.3s ease;
            }
            .sidebar.collapsed ~ *:not(.hamburger) {
                margin-left: 80px !important;
            }
            /* FORCE remove ALL left padding - content touches sidebar */
            body > *:not(.sidebar):not(.hamburger),
            .main-wrapper,
            main,
            .content,
            #app {
                padding-left: 0 !important;  /* NO gap - content starts right at sidebar */
            }
            /* Also fix any containers inside */
            .main-wrapper .container,
            main .container,
            .content .container {
                padding-left: 0 !important;
            }
            @media (max-width: 768px) {
                body > *:not(.sidebar):not(.hamburger) {
                    margin-left: 0 !important;
                }
                body > *:not(.sidebar):not(.hamburger),
                .main-wrapper,
                main,
                .content,
                #app {
                    padding-left: 2rem !important;  /* Small padding on mobile */
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Load sidebar when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSidebar);
    } else {
        loadSidebar();
    }
})();

// Sidebar Functions (global scope so onclick works)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

function loadSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        document.getElementById('sidebar').classList.add('collapsed');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

// Sidebar Loader and Functionality
// This script automatically loads the sidebar and makes all buttons work

(function() {
    // Load the sidebar HTML
    async function loadSidebar() {
        try {
            const response = await fetch('sidebar.html');
            const sidebarHTML = await response.text();
            
            // Insert sidebar at the beginning of body
            document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
            
            // Initialize sidebar functionality after it's loaded
            initializeSidebar();
        } catch (error) {
            console.error('Error loading sidebar:', error);
        }
    }
    
    // Initialize all sidebar functionality
    function initializeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const hamburger = document.getElementById('hamburger');
        const overlay = document.getElementById('sidebarOverlay');
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Load saved sidebar state from localStorage
        loadSidebarState();
        
        // Highlight active page
        highlightActivePage();
        
        // Toggle sidebar (desktop)
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                saveSidebarState();
            });
        }
        
        // Hamburger menu (mobile)
        if (hamburger) {
            hamburger.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
                overlay.classList.toggle('active');
            });
        }
        
        // Close sidebar when clicking overlay (mobile)
        if (overlay) {
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
        }
        
        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
    
    // Highlight the active page in the sidebar
    function highlightActivePage() {
        const currentPage = getCurrentPage();
        const links = document.querySelectorAll('.sidebar-link');
        
        links.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    // Get current page name from the URL
    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'dashboard'; // default to dashboard if empty
    }
    
    // Save sidebar state to localStorage
    function saveSidebarState() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        }
    }
    
    // Load sidebar state from localStorage
    function loadSidebarState() {
        const sidebar = document.getElementById('sidebar');
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        
        if (sidebar && isCollapsed) {
            sidebar.classList.add('collapsed');
        }
    }
    
    // Handle logout with Supabase
    async function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            try {
                // Supabase logout
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                
                // Clear all stored data
                localStorage.clear();
                
                // Redirect to login page
                window.location.href = 'index.html'; // Change if your login page has a different name
            } catch (error) {
                console.error('Logout error:', error);
                alert('Error logging out. Please try again.');
            }
        }
    }
    
    // Load sidebar when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSidebar);
    } else {
        loadSidebar();
    }
})();
